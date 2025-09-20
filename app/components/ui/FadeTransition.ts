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
          mode: 'out-in',
          enterActiveClass: `transition-opacity duration-[var(--transition-duration)]`,
          enterFromClass: 'opacity-0',
          enterToClass: 'opacity-100',
          leaveActiveClass:
            'transition-opacity duration-200',
          leaveFromClass: 'opacity-100',
          leaveToClass: 'opacity-0',
          style: {
            transitionDuration: `${props.duration}ms`,
          },
        },
        () => slots.default?.(),
      );
  },
});
