import { describe, it, expect } from 'vitest';
import { createPage } from '@nuxt/test-utils';

import { setup } from './utils';

describe('Premium Page', async () => {
  await setup();

  it('should render the premium page', async () => {
    const page = await createPage('/premium');

    const h2Text = await page.locator('h2').textContent();

    expect(h2Text).toContain('Premium Subscription');
  });
});
