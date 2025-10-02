import { describe, it, expect } from 'vitest';
import { createPage } from '@nuxt/test-utils';

import { setup } from './utils';

describe('Home Page', async () => {
  await setup();

  it('should render the home page', async () => {
    const page = await createPage('/');

    expect(
      page.locator('h1').textContent(),
    ).resolves.toContain('Link Shortener');
  });
});
