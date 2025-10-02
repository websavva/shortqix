import { describe, it, expect } from 'vitest';
import { createPage } from '@nuxt/test-utils';

import { setup } from './utils';

describe('Premium Page', async () => {
  await setup();

  it('should render the premium page', async () => {
    const page = await createPage('/premium');

    expect(
      page.locator('h2').textContent(),
    ).resolves.toContain('Premium Subscription');
  });
});
