export const partialInGlobalCodes = (parentCL, childCl) => {
  return parentCL
    .sort((a, b) => (a.code > b.code ? 1 : -1))
    .reduce((acc, c) => {
      return [
        ...acc,
        {
          ...c,
          id: c.code,
          label: c.labelLg1,
          isPartial: childCl.some(
            (partial) => partial.code === c.code && partial.parent === c.parent,
          ),
        },
      ];
    }, []);
};
