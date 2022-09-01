import os
import click
import numpy as np
import pandas as pd
from tqdm import tqdm
from PIL import Image
from pathlib import Path
import concurrent.futures
import datetime
import random
random.seed(10)
import uuid
import concurrent.futures
from torchvision import models, transforms, datasets
from models import ResnetImageInferenceModel, ImageDataset, train_model, visualize_model
import torch
import glob
from torch import nn
from torch import optim
from torch.optim import lr_scheduler
import matplotlib.pyplot as plt
from config import ConfigManager

data_transforms = {
    'train': transforms.Compose([
        transforms.Resize((224, 224), Image.BILINEAR),
        transforms.RandomRotation(90),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'val': transforms.Compose([
        transforms.Resize((224, 224), Image.BILINEAR),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

def train(dataset_path, model_path):
    train_dir = os.path.join(dataset_path, "train")
    test_dir = os.path.join(dataset_path, "val")
    train_dataset = datasets.ImageFolder(root=train_dir, transform=data_transforms["train"])
    test_dataset = datasets.ImageFolder(root=test_dir, transform=data_transforms["val"])

    image_datasets = {
        'train': train_dataset,
        'test': test_dataset,
    }
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

    model_ft = ResnetImageInferenceModel.load_from(classes=len(image_datasets['train'].classes))

    model_ft = model_ft.to(device)

    criterion = nn.CrossEntropyLoss()

    # Observe that all parameters are being optimized
    optimizer_ft = optim.SGD(model_ft.parameters(), lr=0.001, momentum=0.9)

    # Decay LR by a factor of 0.1 every 7 epochs
    exp_lr_scheduler = lr_scheduler.StepLR(optimizer_ft, step_size=7, gamma=0.1)

    _, losses = train_model(
        model_ft,
        criterion,
        optimizer_ft,
        exp_lr_scheduler,
        image_datasets,
        model_path,
        num_epochs=10,
        restart=True
    )


@click.command()
@click.argument('version')
def main(version):
    config = ConfigManager()
    test_types = [f for f in os.listdir(config.data["training"]["quality"]["dataset"].format(version=version, test_type='')) if not f.startswith('.')]
    train(
        config.data["training"]["test_type"]["dataset"].format(version=version),
        config.data['training']['test_type']['model_path'].format(version=version),
    )

    for test_type in test_types:
        train(
            config.data["training"]["quality"]["dataset"].format(version=version, test_type=test_type),
            config.data["training"]["quality"]["model_path"].format(version=version, test_type=test_type),
        )
    #plt.plot(range(0, len(losses)), losses, "o")
    #plt.show()

if __name__ == "__main__":
    main()
