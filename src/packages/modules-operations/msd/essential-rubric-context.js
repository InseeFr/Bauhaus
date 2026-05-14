import { isEssentialRubricKo } from "./sims-field-title";

const flatten = (items) => {
  if (!items || items.length === 0) {
    return items || [];
  }
  return [...items, ...flatten(items.flatMap((item) => Object.values(item.children || {})))];
};

export const computeEssentialRubricContext = (metadataStructure, rubricsByIdMas) => {
  const flat = flatten(Object.values(metadataStructure || {}));
  const rubrics = rubricsByIdMas || {};

  return flat.reduce((acc, msd) => {
    const msdCopy = { ...msd };
    if (msdCopy.minOccurs === "1") {
      msdCopy.essentialRubricKoLg1 = isEssentialRubricKo(msdCopy, rubrics[msdCopy.idMas], false);
      msdCopy.essentialRubricKoLg2 = isEssentialRubricKo(msdCopy, rubrics[msdCopy.idMas], true);
    }
    acc[msdCopy.idMas] = msdCopy;
    return acc;
  }, {});
};
