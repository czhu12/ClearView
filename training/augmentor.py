import os
import numpy as np
from torch.utils.data import Dataset, DataLoader
import pandas as pd
from PIL import Image
from torchvision import models, transforms

class ImageCorruptor:
    @staticmethod
    def build():
        tone_transformations = transforms.Compose([
            transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.1),
            transforms.GaussianBlur(kernel_size=11, sigma=(0.1, 2.0)),
        ])
        translation_transformations = transforms.Compose([
            transforms.RandomVerticalFlip(p=0.3),
            transforms.RandomHorizontalFlip(p=0.3),
        ])

        return ImageCorruptor(
            tone_transformations=tone_transformations,
            translation_transformations=translation_transformations,
        )

    def __init__(self, tone_transformations=[], translation_transformations=[]):
        self.tone_transformations = tone_transformations
        self.translation_transformations = translation_transformations
        self.normalize_transformations = transforms.Compose([
            transforms.Resize((224, 224), Image.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    def distortion_score(self, image_1, image_2):
        return (((np.array(image_2) / 255) - (np.array(image_1) / 255)) ** 2).mean()

    def __call__(self, image):
        # Apply translation transformations
        image_1 = self.translation_transformations(image)
        # Apply coloration transformations
        image_2 = self.tone_transformations(image_1)
        # Measure image_v1 and image_v2
        score = self.distortion_score(image_1, image_2)
        # Apply translation transformations
        image_3 = self.translation_transformations(image_2)
        image_4 = self.normalize_transformations(image_3)
        extra = {
            'image': image,
            'image_1': image_1,
            'image_2': image_2,
            'image_3': image_3,
        }
        return image_4, score

class ImageDataset(Dataset):
    @staticmethod
    def load_from_directory(directory):
        image_files = [os.path.join(directory, path) for path in os.listdir(directory)]
        df = pd.DataFrame({'image_path': image_files})
        return ImageDataset(df, transform=ImageCorruptor.build())

    def __init__(self, df, transform=None):
        self.df = df
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        image_path = self.df.iloc[idx]['image_path']
        image = Image.open(image_path)
        transformed, score = self.transform(image)

        return transformed, score
