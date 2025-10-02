import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from 'vitest';
import { mount } from '@vue/test-utils';

import Footer from './Footer.vue';

describe('Footer', () => {
  const mockAppName = 'Shortqix';
  const mockSupportEmail = 'support@shortqix.com';

  beforeEach(() => {
    // Mock process.env
    vi.stubEnv('SQX_APP_NAME', mockAppName);
    vi.stubEnv('SQX_SUPPORT_EMAIL', mockSupportEmail);
  });

  describe('Rendering', () => {
    it('should render the footer element', () => {
      const wrapper = mount(Footer);

      expect(wrapper.find('footer').exists()).toBe(true);
    });

    it('should render the app name', () => {
      const wrapper = mount(Footer);

      expect(
        wrapper.find('[data-test-id="app-name"]').text(),
      ).toContain(mockAppName);
    });

    it('should render the current year in copyright', () => {
      const wrapper = mount(Footer);
      const currentYear = new Date().getFullYear();

      expect(
        wrapper.find('[data-test-id="copyright"]').text(),
      ).toContain(`© ${currentYear}`);
    });

    it('should render the support email', () => {
      const wrapper = mount(Footer);

      expect(wrapper.text()).toContain(mockSupportEmail);
    });

    it('should render LogoBox component', () => {
      const wrapper = mount(Footer);

      expect(
        wrapper.find('[data-test-id="logo-box"]').exists(),
      ).toBe(true);
    });
  });

  describe('Email Link', () => {
    it('should have mailto link for support email', () => {
      const wrapper = mount(Footer);
      const emailLink = wrapper.find(
        'a[data-test-id="support-email"]',
      );

      expect(emailLink.exists()).toBe(true);
      expect(emailLink.attributes('href')).toBe(
        `mailto:${mockSupportEmail}`,
      );
    });

    it('should display support email as link text', () => {
      const wrapper = mount(Footer);
      const emailLink = wrapper.find(
        'a[data-test-id="support-email"]',
      );

      expect(emailLink.text()).toBe(mockSupportEmail);
    });
  });

  describe('Dynamic Year', () => {
    it('should update year dynamically', () => {
      const wrapper = mount(Footer);
      const currentYear = new Date().getFullYear();
      const copyright = wrapper.text();

      expect(copyright).toMatch(
        new RegExp(`© ${currentYear}`),
      );
    });

    it('should not have hardcoded year', () => {
      const wrapper = mount(Footer);
      const oldYear = new Date().getFullYear() - 1;

      // Should not contain previous year
      if (oldYear !== new Date().getFullYear()) {
        expect(wrapper.text()).not.toContain(
          `© ${oldYear}`,
        );
      }
    });
  });

  describe('Environment Variables', () => {
    it('should use APP_NAME from environment', () => {
      const customAppName = 'CustomApp';
      vi.stubEnv('SQX_APP_NAME', customAppName);

      const wrapper = mount(Footer);

      expect(
        wrapper.find('[data-test-id="app-name"]').text(),
      ).toContain(customAppName);
    });

    it('should use SUPPORT_EMAIL from environment', () => {
      const customEmail = 'custom@example.com';
      vi.stubEnv('SQX_SUPPORT_EMAIL', customEmail);

      const wrapper = mount(Footer);
      const emailLink = wrapper.find(
        'a[data-test-id="support-email"]',
      );

      expect(emailLink.text()).toContain(customEmail);
      expect(emailLink.attributes('href')).toBe(
        `mailto:${customEmail}`,
      );
    });
  });
});
