import { InferenceDynamoDb } from "../../src/utils/DynamoDbManager";

export default async function handler(req, res) {
  if (req.method === "POST") {
    var metadataRes = await new InferenceDynamoDb().query(req.body, req.body.lastEvaluatedKey)

    res.status(200).json(metadataRes)
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
