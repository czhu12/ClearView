import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const createBucketPath = (path) => {
  return `inference/v${process.env.AWS_BUCKET_VERSION}/${path}`
}

export const imageBucketPath = createBucketPath("images");
export const metadataBucketPath = createBucketPath("metadata");

export const imageKey = (uid) => {
  return `${uid}.jpeg`
}

export const metadataKey = (uid) => {
  return `${uid}.json`
}
