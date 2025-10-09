import { describe, it, expect } from 'vitest';
import { createPage } from '@nuxt/test-utils';

import { setup, host } from './utils';

describe('Shorten URL', async () => {
  await setup();

  const page = await createPage('/');

  const longUrl = 'https://github.com';
  let shortUrl: string;

  it('should shorten the URL', async () => {
    await page.fill(
      '[data-testid="shorten-link-form-url-input"]',
      longUrl,
    );

    await page.click(
      '[data-testid="shorten-link-form-submit-button"]',
    );

    await page.waitForSelector(
      '[data-testid="shortened-link-box"]',
    );

    const url = await page
      .locator('[data-testid="shortened-link-box-url"]')
      .textContent();

    expect(url).toMatch(
      new RegExp(
        `^${process.env.SQX_BASE_URL!}/s/[a-zA-Z0-9_-]+$`,
      ),
    );

    shortUrl = url!;
  });

  it('should redirect to the long URL', async () => {
    await page.goto(shortUrl);

    await page.waitForURL(longUrl + '/');

    const pageUrl = page.url();

    expect(pageUrl).toBe(longUrl + '/');
  });
});
