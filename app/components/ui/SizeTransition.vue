<script lang="ts">
import {
  type PropType,
  computed,
  useSizeTransition,
  SIZE_TRANSITION_DEFAULT_OPTIONS,
  type UseSizeTransitionOptions,
  h,
  defineComponent,
} from '#imports';
import { Transition } from 'vue';

export default defineComponent({
  props: {
    fadeConfig: {
      type: Object as PropType<
        UseSizeTransitionOptions['fade']
      >,
      default: () => SIZE_TRANSITION_DEFAULT_OPTIONS.fade,
    },

    sizeConfig: {
      type: Object as PropType<
        UseSizeTransitionOptions['size']
      >,
      default: () => SIZE_TRANSITION_DEFAULT_OPTIONS.size,
    },

    concurrent: Boolean,
    disabled: Boolean,

    singular: Boolean,

    heightOnly: Boolean,
  },

  setup(props, { slots }) {
    const options = computed(() => {
      const {
        concurrent,
        disabled,
        fadeConfig: fade,
        sizeConfig: size,
        singular,
        heightOnly,
      } = props;

      return {
        concurrent,
        disabled,
        fade,
        size,
        singular,
        heightOnly,
      };
    });

    const transitionProps = useSizeTransition(options);

    return () =>
      h(Transition, transitionProps, () =>
        slots.default?.(),
      );
  },
});
</script>
