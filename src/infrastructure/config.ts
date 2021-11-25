import { getParameter } from './aws/getParameter';

export default async () => ({
  SECRET_KEY: await getParameter('SECRET_KEY'),
  USERS_MICROSERVICE_GRPC: await getParameter('USERS_MICROSERVICE_GRPC'),
  GRPC_URL: await getParameter('GRPC_URL'),
  COGNITO_USER_POOL_ID: await getParameter('COGNITO_USER_POOL_ID'),
  COGNITO_CLIENT_ID: await getParameter('COGNITO_CLIENT_ID'),
  COGNITO_REGION: await getParameter('COGNITO_REGION'),
});
