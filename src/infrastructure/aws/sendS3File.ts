import * as AWS from 'aws-sdk';
import { getParameter } from './getParameter';
import * as fs from 'fs';

const s3Client = new AWS.S3({
  apiVersion: '2021-11-24',
  region: 'us-east-2',
});

export async function sendFile(
  fileName: string,
  filePath: string,
): Promise<void> {
  const deletePreviousBucketParams = {
    Bucket: await getParameter('LOGS_BUCKET'),
    Key: fileName,
  };
  await s3Client.deleteObject(deletePreviousBucketParams).promise();

  const fileStream = fs.createReadStream(`${filePath}${fileName}`);

  const bucketParams = {
    Bucket: await getParameter('LOGS_BUCKET'),
    Key: fileName,
    Body: fileStream,
  };
  await s3Client.putObject(bucketParams).promise();
}
