import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const createKeyPath = (path, key=null) => {
  return `v${process.env.AWS_BUCKET_VERSION}/${path}${key ? `/${key}` : ""}`;
}

export const imageKey = (uid) => {
  return createKeyPath("images", `${uid}.jpeg`);
}

export const metadataKey = (uid) => {
  return createKeyPath("metadata", `${uid}.json`);
}

export async function getImage(uid){
  const data =  s3.getObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey(uid),
  }).promise();

  return "data:image/jpeg;base64," + encode(data.Body)
}
