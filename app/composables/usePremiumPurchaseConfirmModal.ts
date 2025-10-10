import {
  useModalManager,
  type MaybeRefOrGetter,
  toValue,
} from '#imports';

import type { PremiumPlanId } from '#shared/consts/premium-plans';

export interface UsePremiumPurchaseConfirmModalProps {
  planId: MaybeRefOrGetter<PremiumPlanId>;
  pending: MaybeRefOrGetter<boolean>;
}

export interface OpenPremiumPurchaseConfirmModalOptions {
  planId: MaybeRefOrGetter<PremiumPlanId>;
  pending: MaybeRefOrGetter<boolean>;

  onConfirm: (onSuccess: () => void) => void;
}

export const usePremiumPurchaseConfirmModal = () => {
  const $modal = useModalManager();

  function open(
    props: OpenPremiumPurchaseConfirmModalOptions,
  ) {
    $modal.open({
      component: () =>
        import(
          '@/components/modals/PremiumPurchaseConfirmModal.vue'
        ),
      props: () => ({
        planId: toValue(props.planId),
        pending: toValue(props.pending),
      }),

      on: {
        confirm: (onSuccess: () => void) => {
          props.onConfirm(onSuccess);
        },
      },
    });
  }

  return {
    open,
  };
};
