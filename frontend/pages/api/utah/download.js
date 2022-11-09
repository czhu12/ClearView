import { DynamoDbManager } from '../../../src/utils/DynamoDbManager';

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      if (req.body.password == process.env.APP_UTAH_PASSWORD) {
        const items = await new DynamoDbManager("Primaryhealth-utah").scan({});
        res.status(200).json(items)
      } else {
        res.status(401).json({name: "Unauthorized"})
      }
    } catch {
      res.status(401).json({ error: 'Failed to upload' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
