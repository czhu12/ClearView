import click
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
import torch
from config import ConfigManager
import shutil
from dotenv import load_dotenv
def make_if_not_exist(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

load_dotenv()

@click.command()
@click.argument('version')
def main(version):
    config = ConfigManager()
    source_dir = config.data["training"]["source"]["dataset"].format(version=version)
    source_df = pd.read_csv(os.path.join(source_dir, 'data.csv'))

    test_type_dir = config.data["training"]["test_type"]["dataset"].format(version=version)
    train_dir = os.path.join(test_type_dir, 'train')
    validation_dir = os.path.join(test_type_dir, 'val')
    for i, row in source_df.iterrows():
        basedir = os.path.join(train_dir, row['testType'])
        make_if_not_exist(basedir)
        shutil.copyfile(row['local_image_path'], os.path.join(basedir, os.path.basename(row['local_image_path'])))
if __name__ == "__main__":
    main()
