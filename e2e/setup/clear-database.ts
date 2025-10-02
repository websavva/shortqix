import { afterAll } from 'vitest';

afterAll(async () => {
  await fetch(process.env.SQX_BASE_URL! + '/api/dev/db', {
    method: 'DELETE',
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to clear database');
    }

    return res.json();
  });
});
