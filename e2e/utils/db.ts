import { $fetch } from 'ofetch';

export async function resetDb() {
  await $fetch('/api/dev/db', {
    method: 'DELETE',
    baseURL: process.env.SQX_BASE_URL!,
  });
}
