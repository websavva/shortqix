import {
  shallowRef,
  toValue,
  ref,
  type MaybeRefOrGetter,
  type Component,
  type Slots,
  type ComponentOptions,
  type Ref,
} from 'vue';

export interface ModalItem {
  id: symbol;
  opened: Ref<boolean>;
  component:
    | ComponentOptions
    | (() => Promise<
        ComponentOptions | { default: ComponentOptions }
      >);
  props?: MaybeRefOrGetter<Record<string, any>>;
  on?: Record<string, (...args: any[]) => void>;
  slots?: Slots;
}

export const createModalManager = () => {
  const modals = shallowRef<ModalItem[]>([]);

  function close(id: symbol) {
    modals.value = modals.value.filter(
      (modal) => modal.id !== id,
    );
  }

  function open<Result>({
    component,
    props,
    on,
    slots,
  }: Omit<ModalItem, 'id' | 'opened'>) {
    const loadComponent =
      typeof component === 'function'
        ? component
        : () => Promise.resolve(component);

    return loadComponent().then((component) => {
      const resolvedComponent =
        component.default || component;

      return new Promise<Result | null>((resolve) => {
        const opened = ref(true);
        const id = Symbol('modal');

        let result: Result | null = null;

        modals.value = [
          ...modals.value,
          {
            id,
            opened,
            component: resolvedComponent,
            props: () => {
              return {
                ...toValue(props),
                open: opened.value,
              };
            },
            on: {
              ...on,
              'update:open': (value: boolean) => {
                opened.value = value;

                if (!value) {
                  close(id);
                  resolve(result);
                }
              },
              result: (value: Result) => {
                result = value;
              },
            },
            slots,
          },
        ];
      });
    });
  }

  return {
    modals,
    open,
  };
};

export type ModalManager = ReturnType<
  typeof createModalManager
>;
