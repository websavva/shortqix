import { describe, it, expect } from 'vitest';
import { createPage, url } from '@nuxt/test-utils';
import { JSDOM } from 'jsdom';

import { setup, findMail } from './utils';

describe('Authentication', async () => {
  const email = 'test@test.com';

  await setup();

  describe('Guest', async () => {
    const page = await createPage('/');

    it('should display the navbar for guest', async () => {
      const isNavBarDashboardLinkVisible = await page
        .getByTestId('nav-bar-dashboard-link')
        .isVisible();

      expect(isNavBarDashboardLinkVisible).toBe(false);

      const isNavBarLogoutButtonVisible = await page
        .getByTestId('nav-bar-logout-button')
        .isVisible();

      expect(isNavBarLogoutButtonVisible).toBe(false);

      const isNavBarLoginLinkVisible = await page
        .getByTestId('nav-bar-login-link')
        .isVisible();

      expect(isNavBarLoginLinkVisible).toBe(true);
    });

    it('should redirect to the login page', async () => {
      await page.goto(url('/dashboard'));

      await page.waitForURL((url) => {
        return url.pathname === '/login';
      });

      expect(page.url()).toEqual(url('/login'));
    });

    it('should display the login page', async () => {
      await page.goto(url('/login'));

      await page.waitForSelector(
        '[data-testid="login-form"]',
      );

      expect(page.url()).toEqual(url('/login'));
    });
  });

  describe('User', async () => {
    let magicLink: string;

    const page = await createPage('/login');

    it('should send a magic link to the user', async () => {
      await page.fill(
        'input[data-testid="login-form-email-input"]',
        email,
      );

      await page.click(
        'button[data-testid="login-form-submit-button"]',
      );

      await page.waitForSelector(
        '[data-testid="success-login-form"]',
      );

      const emailText = await page
        .getByTestId('success-login-form-email')
        .textContent();

      expect(emailText).toEqual(email);

      const mail = await findMail('Magic Link', email);

      expect(mail).toBeDefined();

      const mailDom = new JSDOM(mail!.body);

      const magicLinkAnchor =
        mailDom.window.document.querySelector(
          `a[href^="${process.env.SQX_BASE_URL}/verify"]`,
        ) as HTMLAnchorElement | null;

      expect(magicLinkAnchor).toBeDefined();

      magicLink = magicLinkAnchor!.href;
    });

    it('should verify the user', async () => {
      await page.goto(magicLink);

      await page.waitForSelector(
        '[data-testid="success-verify-page"]',
      );

      const h1Text = await page.locator('h1').textContent();

      expect(h1Text?.trim()).toEqual(
        'Email Verified Successfully',
      );
    });

    it('should redirect to the home page', async () => {
      await page.goto(url('/login'));

      await page.waitForURL((url) => {
        return url.pathname === '/';
      });

      expect(page.url()).toEqual(url('/'));
    });

    it('should display the dashboard analytics page', async () => {
      await page.goto(url('/dashboard/analytics'));

      await page.waitForSelector(
        '[data-testid="dashboard-analytics-page"]',
      );

      expect(page.url()).toEqual(
        url('/dashboard/analytics'),
      );
    });

    it('should display navbar for user', async () => {
      await page.goto(url('/'));

      const isNavBarDashboardLinkVisible = await page
        .getByTestId('nav-bar-dashboard-link')
        .isVisible();

      expect(isNavBarDashboardLinkVisible).toBe(true);

      const isNavBarLogoutButtonVisible = await page
        .getByTestId('nav-bar-logout-button')
        .isVisible();

      expect(isNavBarLogoutButtonVisible).toBe(true);

      const isNavBarLoginLinkVisible = await page
        .getByTestId('nav-bar-login-link')
        .isVisible();

      expect(isNavBarLoginLinkVisible).toBe(false);
    });

    it('logout the user', async () => {
      await page.goto(url('/dashboard'));

      await page.click(
        '[data-testid="nav-bar-logout-button"]',
      );

      await page.waitForURL(url('/'));

      expect(page.url()).toEqual(url('/'));

      await page.waitForSelector(
        '[data-testid="nav-bar-login-link"]',
      );

      const isNavBarDashboardLinkVisible = await page
        .getByTestId('nav-bar-dashboard-link')
        .isVisible();

      expect(isNavBarDashboardLinkVisible).toBe(false);

      const isNavBarLogoutButtonVisible = await page
        .getByTestId('nav-bar-logout-button')
        .isVisible();

      expect(isNavBarLogoutButtonVisible).toBe(false);

      const isNavBarLoginLinkVisible = await page
        .getByTestId('nav-bar-login-link')
        .isVisible();

      expect(isNavBarLoginLinkVisible).toBe(true);
    });
  });
});
