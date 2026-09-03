import { isLang2 } from "../../i18n";

/**
 *
 * Take a an array as input, and return a hierarchical tree based on objects
 * @param {Array<Object>} input : the content of a SIMS
 * @param {string} idParent
 * @param {object} objectToMerge
 */
export function getTree(input: any[], idParent?: string, objectToMerge?: any): any {
  return input
    .filter((msd) => msd.idParent === idParent)
    .sort((msd1, msd2) => {
      const msdId1 = parseInt(msd1.idMas.substr(2).replace(".", ""), 10);
      const msdId2 = parseInt(msd2.idMas.substr(2).replace(".", ""), 10);

      return msdId1 - msdId2;
    })
    .reduce((acc, msd) => {
      const msdToMerge = objectToMerge[msd.idMas] || {};
      return {
        ...acc,
        [msd.idMas]: {
          ...msd,
          masLabelBasedOnCurrentLang: isLang2() ? msd.masLabelLg2 : msd.masLabelLg1,
          isPresentational: msdToMerge.isPresentational || false,
          rangeType: msdToMerge.rangeType,
          codeList: msdToMerge.codeList,
          children: getTree(input, msd.idMas, objectToMerge),
          sansObject: msdToMerge.sansObject,
          subPropertyOf: msdToMerge.subPropertyOf,
        },
      };
    }, {});
}
