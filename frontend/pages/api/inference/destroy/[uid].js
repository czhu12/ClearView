import { s3, imageBucketPath, metadataBucketPath, imageKey, metadataKey } from "../../../src/utils";


export default async function handler(req, res) {
  const { uid } = req.query
  if (req.method === "DELETE") {
    var imageParams = {  Bucket: imageBucketPath, Key: imageKey(uid) };
    var metadataParams = {  Bucket: metadataBucketPath, Key: metadataKey(uid) };

    try {
      const imageRes = await s3.deleteObject(imageParams).promise();
      const metadataRes = await s3.deleteObject(metadataParams).promise();
      // do something with response

      res.status(200).json({message: 'success'})
    } catch {
      res.status(401).json({ error: 'Failed to destroy' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
