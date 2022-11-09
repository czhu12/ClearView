export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password == process.env.APP_UTAH_PASSWORD) {
      res.status(200).json({ name: 'Authorized' })
    } else {
      res.status(401).json({ name: 'Unauthorized' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
