import click
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
import torch
from config import ConfigManager
import shutil
from dotenv import load_dotenv
from utils import make_if_not_exist
load_dotenv()

@click.command()
@click.argument('version')
def main(version):
    config = ConfigManager()
    source_dir = config.data["training"]["source"]["dataset"].format(version=version)
    source_df = pd.read_csv(os.path.join(source_dir, 'data.csv'))

    test_type_dir = config.data["training"]["test_type"]["dataset"].format(version=version)
    test_type_train_dir = os.path.join(test_type_dir, 'train')
    test_type_validation_dir = os.path.join(test_type_dir, 'val')


    for i, row in source_df.iterrows():
        target_dir = test_type_train_dir if row['mode'] == 'train' else test_type_validation_dir
        test_type_basedir = os.path.join(target_dir, row['testType'])
        make_if_not_exist(test_type_basedir)
        shutil.copyfile(row['local_image_path'], os.path.join(test_type_basedir, os.path.basename(row['local_image_path'])))

        quality_dir = config.data["training"]["quality"]["dataset"].format(version=version, test_type=row['testType'])
        quality_train_dir = os.path.join(quality_dir, 'train')
        quality_validation_dir = os.path.join(quality_dir, 'val')

        quality_target_dir = quality_train_dir if row['mode'] == 'train' else quality_validation_dir
        quality_basedir = os.path.join(quality_target_dir, row['quality'])
        print(quality_basedir)
        make_if_not_exist(quality_basedir)
        shutil.copyfile(row['local_image_path'], os.path.join(quality_basedir, os.path.basename(row['local_image_path'])))

if __name__ == "__main__":
    main()
