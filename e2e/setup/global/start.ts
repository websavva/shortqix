import { start } from '../../utils';

export default async function startServer() {
  const stop = await start();

  return async () => {
    await stop();
  };
}
