import { computed, unref } from '#imports';
import type { BaseTransitionProps } from '@vue/runtime-core';
import defu from 'defu';
import type { MaybeRef } from '@vueuse/core';

export interface UseSizeTransitionOptions {
  fade?: KeyframeAnimationOptions;
  size?: KeyframeAnimationOptions;
  concurrent?: boolean;
  disabled?: boolean;
  singular?: boolean;
  heightOnly?: boolean;
}

export type UseSizeTransitionPropsWithListeners = Required<
  Pick<BaseTransitionProps, 'mode' | 'onEnter' | 'onLeave'>
> & {
  css: false;
};

export const SIZE_TRANSITION_DEFAULT_OPTIONS: UseSizeTransitionOptions =
  {
    fade: {
      duration: 3e2,
      easing: 'ease-out',
    },

    size: {
      duration: 5e2,
      easing: 'cubic-bezier(.19,1,.22,1)',
    },

    concurrent: true,
    disabled: false,
    singular: false,
    heightOnly: false,
  };

const throwNonHTMLElementUsageError = () => {
  throw new Error(
    `[useSizeTransition] Only HTMLElement is allowed for usage !`,
  );
};

const wrapListenerWithElementValidator = (
  listener: (el: HTMLElement, done: () => void) => void,
) => {
  return (el: Element, done: () => void) => {
    if (!(el instanceof HTMLElement))
      throwNonHTMLElementUsageError();

    listener(el as HTMLElement, done);
  };
};

export const useSizeTransition = (
  options: MaybeRef<UseSizeTransitionOptions> = {},
) => {
  const adjustedOptions = computed(() => {
    return defu(
      unref(options),
      SIZE_TRANSITION_DEFAULT_OPTIONS,
    );
  });

  const getPixels = (size: number) => `${size}px`;

  let prevHeight: number = 0;
  let prevWidth: number = 0;

  const onLeave = wrapListenerWithElementValidator(
    async (el: HTMLElement, done: () => void) => {
      if (adjustedOptions.value.disabled) return done();

      el.style.overflow = 'hidden';

      ({
        offsetHeight: prevHeight,
        offsetWidth: prevWidth,
      } = el);

      await el.animate(
        [
          {
            opacity: 1,
            ...(adjustedOptions.value.singular && {
              height: getPixels(prevHeight),
              ...(!adjustedOptions.value.heightOnly && {
                width: getPixels(prevWidth),
              }),
            }),
          },
          {
            opacity: 0,
            ...(adjustedOptions.value.singular && {
              height: 0,
              ...(!adjustedOptions.value.heightOnly && {
                width: 0,
              }),
            }),
          },
        ],
        adjustedOptions.value.fade,
      ).finished;

      el.style.overflow = '';

      done();
    },
  );

  const onEnter = wrapListenerWithElementValidator(
    (el: HTMLElement, done: () => void) => {
      const { concurrent, disabled } =
        adjustedOptions.value;

      if (disabled) return done();

      requestAnimationFrame(async () => {
        el.style.opacity = '0';
        el.style.overflow = 'hidden';

        await el.animate(
          [
            {
              ...(!adjustedOptions.value.heightOnly && {
                width: adjustedOptions.value.singular
                  ? 0
                  : getPixels(prevWidth),
              }),
              height: adjustedOptions.value.singular
                ? 0
                : getPixels(prevHeight),
              ...(concurrent && { opacity: 0 }),
            },
            {
              ...(!adjustedOptions.value.heightOnly && {
                width: getPixels(el.offsetWidth),
              }),
              height: getPixels(el.offsetHeight),
              ...(concurrent && { opacity: 1 }),
            },
          ],
          adjustedOptions.value.size,
        ).finished;

        if (!concurrent)
          await el.animate(
            [
              {
                opacity: 0,
              },
              {
                opacity: 1,
              },
            ],
            adjustedOptions.value.fade,
          );

        el.style.height = '';
        el.style.width = '';
        el.style.opacity = '';
        el.style.overflow = '';

        done();
      });
    },
  );

  return {
    mode: 'out-in',
    css: false,

    onEnter,
    onLeave,
  } as UseSizeTransitionPropsWithListeners;
};
