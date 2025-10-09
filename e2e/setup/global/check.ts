import { join } from 'node:path';

import { sleep } from '../../../shared/utils/sleep';

function sendRequest(path: string) {
  const url = new URL(
    join('/api', path),
    process.env.SQX_BASE_URL,
  );

  return fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to send request to ${url}`);
    }

    return res.json();
  });
}

async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  retryDelay = 1000,
) {
  while (retries > 0) {
    try {
      return await fn();
    } catch (err) {
      retries--;
      await sleep(retryDelay);

      if (!retries) {
        throw err;
      }
    }
  }
}

export default async function checkHealth() {
  await retry(() => sendRequest('health'));
}
