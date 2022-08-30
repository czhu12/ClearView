import { s3, imageBucketPath, metadataBucketPath } from "../../src/utils";

const listContents = async ({ Bucket, nextContinuationToken }) => {
  let res = await s3
    .listObjectsV2({
      Bucket,
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
    try {
      var metadataRes = await listContents({
        Bucket: "metadata",
        nextContinuationToken: req.body.nextContinuationToken
      });

      res.status(200).json({contents: metadataRes})
    } catch {
      res.status(401).json({ error: 'Failed to upload' });
    }
  } else {
    res.status(404).json({ name: 'Not found' });
  }
}
