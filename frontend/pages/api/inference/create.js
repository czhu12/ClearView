import { v4 as uuidv4 } from 'uuid';
import { s3, imageKey, metadataKey } from "../../../src/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uid = uuidv4();
    try {
      var responseJpeg = await s3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey(uid),
        Body: req.body.image,
      }).promise();

      var metadata = Buffer.from(JSON.stringify(req.body.metadata));

      var responeJson = await s3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: metadataKey(uid),
        Body: metadata,
        ContentEncoding: 'base64',
        ContentType: 'application/json',
      }).promise();

      res.status(200).json({message: 'success'})
    } catch {
      res.status(401).json({ error: 'Failed to upload' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
