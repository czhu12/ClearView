import click
from torch.utils.data import DataLoader
import torch
from torch import nn
from augmentor import ImageDataset
import pytorch_lightning as pl
import torchvision.models as models
import torch.nn.functional as F

class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = models.mobilenet_v2(pretrained=True)
        self.linear = nn.Linear(1000, 1) # Get 1 numbers out

    def forward(self, x):
        encoded = self.encoder(x)
        return self.linear(encoded)


class ImageQualityTask(pl.LightningModule):
    def __init__(self):
        super().__init__()
        self.model = Model()

    def forward(self, x):
        # in lightning, forward defines the prediction/inference actions
        embedding = self.model(x)
        return embedding

    def training_step(self, batch, batch_idx):
        # training_step defines the train loop. It is independent of forward
        x, label = batch
        regression = self.model(x)
        loss = F.mse_loss(regression, label.float())
        self.log("train_loss", loss, prog_bar=True)
        return loss

    def validation_step(self, batch, batch_idx):
        x, label = batch
        regression = self.model(x)
        loss = F.mse_loss(regression, label.float())
        self.log("val_loss", loss, prog_bar=True)
        return loss


    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
        return optimizer


@click.command()
@click.argument('train_images_path')
@click.argument('val_images_path')
def main(train_images_path, val_images_path):
    train_dataset = ImageDataset.load_from_directory(train_images_path)
    val_dataset = ImageDataset.load_from_directory(val_images_path)

    task = ImageQualityTask()
    trainer = pl.Trainer(max_epochs=2)
    trainer.fit(task, DataLoader(train_dataset), DataLoader(val_dataset))


if __name__ == "__main__":
    main()
