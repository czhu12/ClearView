import { s3, imageKey, metadataKey } from "../../../src/utils";

export default async function handler(req, res) {
  const { uid } = req.query
  if (req.method === "DELETE") {
    var imageParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: imageKey(uid) };
    var metadataParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: metadataKey(uid) };

    try {
      const imageRes = await s3.deleteObject(imageParams).promise();
      const metadataRes = await s3.deleteObject(metadataParams).promise();
      res.status(200).json({message: 'success'})
    } catch {
      res.status(401).json({ error: 'Failed to destroy' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
