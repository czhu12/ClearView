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

      const image = "data:image/jpeg;base64," + encode(imageData.Body)

      const metadata = await new InferenceDynamoDb().find(uid)

      res.status(200).json({ image, metadata })
    } catch {
      res.status(401).json({ error: 'Failed to fetch' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
