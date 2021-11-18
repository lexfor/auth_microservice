import * as AWS from 'aws-sdk';

const ssmClient = new AWS.SSM({
  apiVersion: '2021-11-17',
  region: 'us-east-2',
});

export async function getParameter(name: string): Promise<string> {
  const result = await ssmClient
    .getParameter({
      Name: name,
    })
    .promise();
  return result.Parameter.Value;
}
