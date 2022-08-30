import { v4 as uuidv4 } from 'uuid';
import { s3, imageBucketPath, metadataBucketPath, imageKey, metadataKey } from "../../../src/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uid = uuidv4();
    try {
      var responseJpeg = await s3.upload({
        Bucket: imageBucketPath,
        Key: imageKey(uid),
        Body: req.body.image,
      }).promise();
    
      var responeJson = await s3.upload({
        Bucket: metadataBucketPath,
        Key: metadataKey(uid),
        Body: req.body.metadata,
      }).promise();

      // do something with response

      res.status(200).json({message: 'success'})
    } catch {
      res.status(401).json({ error: 'Failed to upload' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
