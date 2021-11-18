import { getParameter } from './getParameter';

export default async () => ({
  SECRET_KEY: await getParameter('SECRET_KEY'),
});
