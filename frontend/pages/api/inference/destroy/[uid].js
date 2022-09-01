import { s3, imageKey, metadataKey } from "../../../src/utils";

export default async function handler(req, res) {
  const { uid } = req.query
  if (req.method === "DELETE") {
    try {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey(uid)
      }).promise();

      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: metadataKey(uid)
      }).promise();

      res.status(200).json({message: 'success'})
    } catch {
      res.status(401).json({ error: 'Failed to destroy' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}