/**
 * Flatten a hierarchical tree. Return the same type of data : an object with the
 * ID of the element as a key
 * @param {Object} tree
 */
export function flattenTree(tree: any): any {
  if (!tree) {
    return null;
  }
  return Object.keys(tree).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        ...tree[key],
      },
      ...flattenTree(tree[key].children),
    };
  }, {});
}
