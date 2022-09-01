import click
import io
import base64
from PIL import Image
import json
import random
import pandas as pd
import boto3
import matplotlib.pyplot as plt
import numpy as np
import os
import torch
from config import ConfigManager
from dotenv import load_dotenv
from utils import make_if_not_exist

load_dotenv()
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

@click.command()
@click.argument('version')
def main(version):
    config = ConfigManager()
    session = boto3.Session(
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    )
    source_dir = config.data["training"]["source"]["dataset"].format(version=version)
    train_dir = os.path.join(source_dir, 'train')
    make_if_not_exist(train_dir)
    validation_dir = os.path.join(source_dir, 'val')
    make_if_not_exist(validation_dir)

    s3 = session.resource('s3')
    bucket = s3.Bucket(BUCKET_NAME)
    all_data = []
    for object_summary in bucket.objects.filter(Prefix="{version}/metadata/".format(version=version)):
        remote_metadata_path = object_summary.key
        if not remote_metadata_path.endswith('.json'):
            continue
        key = os.path.basename(remote_metadata_path.split(".")[0])
        remote_image_path = os.path.join("v1/images", key + ".jpeg")

        mode = 'train' if random.random() < 0.8 else 'val'
        target_dir = train_dir if mode == 'train' else validation_dir

        local_metadata_path = os.path.join(target_dir, remote_metadata_path)
        local_image_path = os.path.join(target_dir, key + ".jpg")
        obj = bucket.Object(remote_metadata_path)
        metadata = json.loads(obj.get()['Body'].read())

        img = bucket.Object(remote_image_path)
        with open(local_image_path, 'wb') as f:
            f.write(img.get()['Body'].read())

        paths = {
            'local_image_path': local_image_path,
            'remote_image_path': remote_image_path,
            'remote_metadata_path': remote_metadata_path,
            'mode': mode,
        }
        data = {**metadata, **paths}
        all_data.append({**metadata, **paths})
    df = pd.DataFrame(all_data)
    df.to_csv(os.path.join(source_dir, "data.csv"))


if __name__ == "__main__":
    main()
