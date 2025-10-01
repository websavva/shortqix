import { describe, it, expect } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';

import ErrorPane from './ErrorPane.vue';

describe('ErrorPane', () => {
  const defaultProps = {
    title: 'Error Title',
    message: 'Error message description',
  };

  describe('Rendering', () => {
    it('should render the error pane', () => {
      const wrapper = mount(ErrorPane, {
        props: defaultProps,
      });

      expect(
        wrapper.find('.bg-destructive\\/10').exists(),
      ).toBe(true);
    });

    it('should render the title', () => {
      const wrapper = mount(ErrorPane, {
        props: defaultProps,
      });

      expect(
        wrapper.find('[data-test-id="title"]').text(),
      ).toContain(defaultProps.title);
    });

    it('should render the message', () => {
      const wrapper = mount(ErrorPane, {
        props: defaultProps,
      });
      const messageElement = wrapper.find(
        '[data-test-id="message"]',
      );

      expect(messageElement.text()).toContain(
        defaultProps.message,
      );
    });

    it('should render the AlertCircle icon', () => {
      const wrapper = mount(ErrorPane, {
        props: defaultProps,
      });

      // AlertCircle is an SVG icon component
      expect(
        wrapper
          .find('[data-test-id="alert-circle"]')
          .exists(),
      ).toBe(true);
    });
  });

  describe('Title Prop', () => {
    it('should display custom title', () => {
      const customTitle = 'Custom Error Title';
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          title: customTitle,
        },
      });

      expect(wrapper.text()).toContain(customTitle);
    });
  });

  describe('Message Prop', () => {
    it('should display custom message', () => {
      const customMessage =
        'This is a custom error message';
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          message: customMessage,
        },
      });

      expect(wrapper.text()).toContain(customMessage);
    });

    it('should render message with muted styling', () => {
      const wrapper = mount(ErrorPane, {
        props: defaultProps,
      });

      const messageElement = wrapper.find(
        '[data-test-id="message"]',
      );

      expect(messageElement.exists()).toBe(true);
      expect(messageElement.text()).toBe(
        defaultProps.message,
      );
    });
  });

  describe('Retry Button', () => {
    it('should show retry button by default', () => {
      const wrapper = mount(ErrorPane, {
        props: defaultProps,
      });

      const button = wrapper.find(
        '[data-test-id="retry-button"]',
      );

      expect(button.exists()).toBe(true);
      expect(button.text()).toBe('Try Again');
    });

    it('should show retry button when isRetryable is true', () => {
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          isRetryable: true,
        },
      });

      const button = wrapper.find(
        '[data-test-id="retry-button"]',
      );

      expect(button.exists()).toBe(true);
    });

    it('should hide retry button when isRetryable is false', () => {
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          isRetryable: false,
        },
      });

      const button = wrapper.find(
        '[data-test-id="retry-button"]',
      );

      expect(button.exists()).toBe(false);
    });

    it('should emit retry event when button is clicked', async () => {
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          isRetryable: true,
        },
      });

      const button = wrapper.find(
        '[data-test-id="retry-button"]',
      );

      await button.trigger('click');

      expect(wrapper.emitted('retry')).toBeTruthy();
      expect(wrapper.emitted('retry')).toHaveLength(1);
    });

    it('should emit retry event multiple times', async () => {
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          isRetryable: true,
        },
      });

      const button = wrapper.find(
        '[data-test-id="retry-button"]',
      );

      await button.trigger('click');
      await button.trigger('click');
      await button.trigger('click');

      expect(wrapper.emitted('retry')).toHaveLength(3);
    });
  });

  describe('Pending State', () => {
    it('should pass pending prop to button', () => {
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          pending: true,
        },
      });

      const button = wrapper.findComponent(
        '[data-test-id="retry-button"]',
      ) as VueWrapper<any, any>;

      expect(button.props('pending')).toBe(true);
    });

    it('should not pass pending when false', () => {
      const wrapper = mount(ErrorPane, {
        props: {
          ...defaultProps,
          pending: false,
        },
      });

      const button = wrapper.findComponent(
        '[data-test-id="retry-button"]',
      ) as VueWrapper<any, any>;

      expect(button.props('pending')).toBe(false);
    });

    it('should default to false when pending not provided', () => {
      const wrapper = mount(ErrorPane, {
        props: defaultProps,
      });

      const button = wrapper.findComponent(
        '[data-test-id="retry-button"]',
      ) as VueWrapper<any, any>;

      expect(button.props('pending')).toBe(false);
    });
  });
});
