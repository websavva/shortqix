<script lang="ts">
import { useModalManager, h, toValue } from '#imports';

import { firstUpperCase } from '#shared/utils/first-upper-case';

export default defineComponent({
  setup() {
    const modalManager = useModalManager();

    return () => {
      return h(
        'div',
        modalManager.modals.value.map((modal) => {
          const formattedListeners = Object.fromEntries(
            Object.entries(modal.on || {}).map(
              ([key, value]) => [
                `on${firstUpperCase(key)}`,
                value,
              ],
            ),
          );

          return h(
            modal.component,
            {
              key: modal.id,
              ...toValue(modal.props),
              ...formattedListeners,
            },
            modal.slots,
          );
        }),
      );
    };
  },
});
</script>
