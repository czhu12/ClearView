import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
  region: process.env.APP_AWS_REGION,
  accessKeyId: process.env.APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.APP_AWS_SECRET_KEY,
});

export const createKeyPath = (path, key=null) => {
  return `v${process.env.APP_AWS_BUCKET_VERSION}/${path}${key ? `/${key}` : ""}`;
}

export const imageKey = (uid) => {
  return createKeyPath("images", `${uid}.jpeg`);
}

export const metadataKey = (uid) => {
  return createKeyPath("metadata", `${uid}.json`);
}

export function encode(data){
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64
}