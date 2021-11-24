import { getParameter } from './aws/getParameter';

export default async () => ({
  SECRET_KEY: await getParameter('SECRET_KEY'),
  USERS_MICROSERVICE_GRPC: await getParameter('USERS_MICROSERVICE_GRPC'),
  GRPC_URL: await getParameter('GRPC_URL'),
});
