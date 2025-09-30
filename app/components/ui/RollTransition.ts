import { defineComponent, Transition } from 'vue';

export default defineComponent({
  props: {
    duration: {
      type: Number,
      default: 200,
    },
  },

  setup(props, { slots }) {
    return () =>
      h(
        Transition,
        {
          enterActiveClass: 'transition-all duration-[var(--transition-duration)]',
          enterFromClass: 'opacity-0 -translate-y-[100%]',
          enterToClass: 'opacity-100 translate-y-0',
          leaveActiveClass:
            'transition-opacity duration-[var(--transition-duration)]',
          leaveFromClass: 'opacity-100 translate-y-0',
          leaveToClass: 'opacity-0 translate-y-[100%]',
          style: {
            transitionDuration: `${props.duration}ms`,
          },
        },
        () => slots.default?.(),
      );
  },
});
