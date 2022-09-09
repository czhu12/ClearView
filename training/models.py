import torch
from PIL import Image
from torch import nn
import torchvision
from torchvision import models, transforms
from torch.utils.data import Dataset, DataLoader
import os
import pandas as pd
import numpy as np
from PIL import Image
import torch.optim as optim
from torch.optim import lr_scheduler
import time
import copy
import tqdm
from torch import nn
from utils import make_if_not_exist

try:
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
except:
    device = "cpu"

class ImageInferenceModel(nn.Module):
    @staticmethod
    def load_from(path=None, classes=2):
        model = ImageInferenceModel(num_classes=classes)
        if path:
            print("Loading model from {}".format(path))
            model.load_state_dict(torch.load(path))
        return model

    def __init__(self, num_classes=2):
        super().__init__()
 
        self.encoder = models.squeezenet.squeezenet1_1(pretrained=True)
        self.decoder = nn.Linear(1000, num_classes)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224), Image.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    def forward(self, x):
        return self.decoder(self.encoder(x))
        
    def predict_image(self, image_path, threshold=0.5):
        image = Image.open(image_path)
        return self._predict_image(image, threshold=threshold)
    
    def _predict_image(self, image, threshold=0.5):
        img_vec = self.transform(image)
        _input = torch.unsqueeze(img_vec, 0)
        self.model.eval()
        prediction = self.model(_input)
        if threshold is None:
            return torch.argmax(prediction[0]).tolist()
        else:
            softmax = torch.softmax(prediction[0], dim=0)
            idx = torch.argmax(prediction[0]).tolist()
            if softmax[idx].tolist() > threshold:
                return idx

    def predict_tensor(self, data):
        prediction = self.model(torch.unsqueeze(data, 0))
        return torch.argmax(prediction[0]).tolist()

class ImageDataset(Dataset):
    def __init__(self, df, transform=None):
        self.df = df
        self.transform = transform
        self.classes = [int(c) for c in self.df['label'].unique()]

    def __len__(self):
        return len(self.df)
    
    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()

        img_name = self.df.iloc[idx]['image_path']
        y = int(self.df.iloc[idx]['label'])
        image = Image.open(img_name)
        image = image.resize((224, 224))
        if self.transform:
            image = self.transform(image)
        
        return image, y

def train_model(
    model,
    criterion,
    optimizer,
    scheduler,
    image_datasets,
    model_path,
    num_epochs=25,
    restart=False,
):
    since = time.time()
    dataloaders = {
        'train': torch.utils.data.DataLoader(image_datasets['train'], batch_size=8, shuffle=True, num_workers=0),
        'test': torch.utils.data.DataLoader(image_datasets['test'], batch_size=8, shuffle=True, num_workers=0)
    }

    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'test']}
    if restart:
        print("Not loading pre-existing model")
    elif os.path.exists(model_path):
        model_weights = torch.load(model_path)
        model.load_state_dict(model_weights)
        print("Loading model from {}".format(model_path))
    else:
        print("Model {} not found".format(model_path))

    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0
    losses = []

    for epoch in range(num_epochs):
        print('Epoch {}/{}'.format(epoch, num_epochs - 1))
        print('-' * 10)

        # Each epoch has a training and test phase
        for phase in ['test', 'train']:
            if phase == 'train':
                model.train()  # Set model to training mode
            else:
                model.eval()   # Set model to evaluate mode

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data.
            for inputs, labels in tqdm.tqdm(dataloaders[phase]):
                inputs = inputs.to(device)
                labels = labels.to(device)

                # zero the parameter gradients
                optimizer.zero_grad()

                # forward
                # track history if only in train
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)
                    losses.append(loss.tolist())

                    # backward + optimize only if in training phase
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                # statistics
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)
            if phase == 'train':
                scheduler.step()

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print('{} Loss: {:.4f} Acc: {:.4f}'.format(
                phase, epoch_loss, epoch_acc))

            # deep copy the model
            if phase == 'test' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
                make_if_not_exist(model_path)
                torch.save(model.state_dict(), model_path)
                print("Saved model to {}".format(model_path))
        print()

    time_elapsed = time.time() - since
    print('Training complete in {:.0f}m {:.0f}s'.format(
        time_elapsed // 60, time_elapsed % 60))
    print('Best test Acc: {:4f}'.format(best_acc))

    # load best model weights
    model.load_state_dict(best_model_wts)
    return (model, losses)

def visualize_model(model, num_images=6):
    was_training = model.training
    model.eval()
    images_so_far = 0
    fig = plt.figure()

    with torch.no_grad():
        for i, (inputs, labels) in enumerate(dataloaders['test']):
            inputs = inputs.to(device)
            labels = labels.to(device)

            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)

            for j in range(inputs.size()[0]):
                images_so_far += 1
                ax = plt.subplot(num_images//2, 2, images_so_far)
                ax.axis('off')
                ax.set_title('predicted: {}'.format(class_names[preds[j]]))
                imshow(inputs.cpu().data[j])

                if images_so_far == num_images:
                    model.train(mode=was_training)
                    return
        model.train(mode=was_training)

