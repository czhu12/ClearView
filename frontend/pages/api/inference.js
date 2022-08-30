import { s3, createKeyPath } from "../../src/utils";

const listContents = async ({ nextContinuationToken }) => {
  let res = await s3
    .listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: createKeyPath("metadata"),
      ContinuationToken: nextContinuationToken || undefined,
    })
    .promise();
  var contents = res.Contents;
  
  if (!res.IsTruncated) {
    return({ contents, nextContinuationToken: null })
  } else {
    return({ contents, nextContinuationToken: res.NextContinuationToken })
  }
};


export default async function handler(req, res) {
  if (req.method === "GET") {
    // try {
      var metadataRes = await listContents({
        nextContinuationToken: req.body.nextContinuationToken
      });

      res.status(200).json({contents: metadataRes})
    // } catch {
    //   res.status(401).json({ error: 'Failed to upload' });
    // }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
