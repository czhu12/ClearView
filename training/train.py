import click
import matplotlib.pyplot as plt
import numpy as np
import os
import torch
from config import ConfigManager
from dotenv import load_dotenv

load_dotenv()

BATCH_SIZE = 32
BUCKET_NAME = 'primaryhealth-predictions'
IMG_SIZE = (224, 224)

@click.command()
@click.argument('version')
def main(version):
    config = ConfigManager()
    session = boto3.Session(
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    )
    source_dir = config.data["training"]["source"].format(version=version)
    train_dir = os.path.join(source_dir, 'train')
    validation_dir = os.path.join(source_dir, 'val')

    s3 = session.resource('s3')
    bucket = s3.Bucket(BUCKET_NAME)
    df = pd.DataFrame()
    for object_summary in bucket.objects.filter(Prefix="{}/metadata/".format(version=version)):
        remote_metadata_path = object_summary.key
        key = os.path.basename(remote_metadata_path.split(".")[0])
        remote_image_path = os.path.join("v1/images", key)

        target_dir = train_dir if random.random() < 0.8 else validation_dir

        local_metadata_path = os.path.join(target_dir, remote_metadata_path)
        local_image_path = os.path.join(target_dir, key + ".jpg")
        obj = bucket.Object(remote_metadata_path)
        metadata = json.loads(obj.get()['Body'].read())

        img = bucket.Object(remote_image_path)
        base64_url = str(img.get()['Body'].read())
        image = Image.open(io.BytesIO(base64.b64decode(base64_url.split(',')[1])))
        image.save(local_image_path)
        paths = {
            'local_image_path': local_image_path,
            'remote_image_path': remote_image_path,
            'remote_metadata_path': remote_metadata_path,
        }
        data = {**metadata, **paths}
        df.append({**metadata, **paths}, ignore_index=True)
    df.to_csv(os.path.join(download_dir, "data.csv"))


if __name__ == "__main__":
    main()
