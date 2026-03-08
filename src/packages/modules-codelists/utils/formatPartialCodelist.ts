export const formatPartialCodelist = (cl: any, parentCl: any) => {
  if (cl.codes) {
    cl.codes = (Object.values(cl.codes) as any[])
      .sort((a, b) => (a.code > b.code ? 1 : -1))
      .reduce<Record<string, any>>((acc, c) => {
        return {
          ...acc,
          [c.code]: {
            ...c,
            id: c.code,
          },
        };
      }, {});
  }
  return {
    ...cl,
    parentCode: parentCl.id,
    parentLabel: parentCl.labelLg1,
  };
};
