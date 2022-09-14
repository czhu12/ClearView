import { s3, imageKey, metadataKey, encode } from "../../../src/utils";
import { InferenceDynamoDb } from "../../../src/utils/DynamoDbManager";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { uid } = req.query
    try {
      const imageData = await s3.getObject({
        Bucket: process.env.APP_AWS_BUCKET_NAME,
        Key: imageKey(uid),
      }).promise();

      const db = await new InferenceDynamoDb().query({testType: "abbott", quality: "good"})

      const image = "data:image/jpeg;base64," + encode(imageData.Body)

      const metadataData = await s3.getObject({
        Bucket: process.env.APP_AWS_BUCKET_NAME,
        Key: metadataKey(uid),
      }).promise();
    
      const metadata = JSON.parse(metadataData.Body.toString('utf-8'));
   

      res.status(200).json({ image, metadata, db })
    } catch {
      res.status(401).json({ error: 'Failed to fetch' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
