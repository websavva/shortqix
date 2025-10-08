import type { NodeTransform } from '@vue/compiler-core';

const TEST_ATTRIBUTE_REGEX = /^:?data-test-?id$/;

export const RemoveTestAttributePlugin: NodeTransform = (
  node,
  _,
) => {
  if (node.type === 1) {
    node.props = node.props.filter((prop) => {
      if (prop.type === 7) {
        if (!prop.arg) return true;

        return (
          prop.arg.type !== 4 ||
          !TEST_ATTRIBUTE_REGEX.test(prop.arg.content)
        );
      } else {
        return !TEST_ATTRIBUTE_REGEX.test(prop.name);
      }
    });
  }
};
