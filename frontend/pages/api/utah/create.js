import { DynamoDbManager } from '../../../src/utils/DynamoDbManager';

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = { id: req.body.id, tag: req.body.tag };
      form.number_one = parseFloat(req.body.number_one);
      if (req.body.number_two) form.number_two = parseFloat(req.body.number_two);
      if (req.body.number_three) form.number_three = parseFloat(req.body.number_three);
      if (req.body.number_four) form.number_four = parseFloat(req.body.number_four);
      if (req.body.number_five) form.number_five = parseFloat(req.body.number_five);
      await new DynamoDbManager("Primaryhealth-utah").create(form);
      res.status(200).json({message: 'success'})
    } catch {
      res.status(401).json({ error: 'Failed to upload' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
