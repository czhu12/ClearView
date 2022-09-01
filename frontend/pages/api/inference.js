import { s3, createKeyPath } from "../../src/utils";

const listContents = async ({ startAfter }) => {
  const prefix = createKeyPath("metadata") + "/";
  const suffix = ".json";
  let res = await s3
    .listObjectsV2({
      Bucket: process.env.APP_AWS_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 10,
      StartAfter: startAfter || undefined,
    })
    .promise();
  const contents = res.
    Contents.
    map(x => x.Key)
  
  const uids = contents.
    filter(x => x.endsWith(suffix)).
    map(x => x.slice(prefix.length, x.length - suffix.length));

  return({ uids, startAfter: uids.length == 0 ? null : contents[contents.length - 1] })
};


export default async function handler(req, res) {
  if (req.method === "GET") {
    var metadataRes = await listContents({
      startAfter: req.query.startAfter,
    });

    res.status(200).json(metadataRes)
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
