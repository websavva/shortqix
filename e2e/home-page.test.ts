import { describe, it, expect } from 'vitest';
import { createPage } from '@nuxt/test-utils';

import { setup } from './utils';

describe('Home Page', async () => {
  await setup();

  it('should render the home page', async () => {
    const page = await createPage('/');

    const h1Text = await page.locator('h1').textContent();

    const normalizedH1Text = (h1Text || '')
      .split(' ')
      .map((word) => word.trim())
      .filter(Boolean)
      .join(' ');

    expect(normalizedH1Text).toEqual(
      'Shortqix. Link Shortener Create short links for fast and easy sharing',
    );

    const title = await page.locator('title').textContent();

    expect(title).toEqual(
      'Home | Shortqix - Fast, reliable URL shortening service',
    );

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');

    expect(description).toEqual(
      'Shorten your links with ease',
    );
  });
});
