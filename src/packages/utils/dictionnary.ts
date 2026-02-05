export const createAllDictionary = (dict: any) => {
  const D1 = createDictionary(firstLang, dict);
  const D2 = createDictionary(secondLang, dict);

  return {
    D1,
    D2,
    D: getLang() === firstLang ? D1 : D2,
    lg1: firstLang,
    lg2: secondLang,
  };
};

/**
 * Based on the locale passed as a paremeter, this function will return
 * the corresponding dictionary.
 *
 * @param {string} lang the lang of the user
 * @param {any} dict
 */
export const createDictionary = (lang: string, dict: any): Record<string, any> =>
  Object.keys(dict).reduce((acc, k) => {
    const hasChildObject = Object.keys(dict[k]).find(
      (key) =>
        dict[k][key] && typeof dict[k][key] === "object" && dict[k][key].constructor === Object,
    );
    return {
      ...acc,
      [k]: !hasChildObject ? dict[k][lang] : createDictionary(lang, dict[k]),
    };
  }, {});

/**
 * This function will return only the lang part of a locale
 * For example, with fr-FR, will return fr
 * If the lang is not fr, will return en
 * @param {string} lang the lang of the user
 */

export const firstLang = "fr";
export const secondLang = "en";

/**
 * Return the current lang based of the settings of the browser
 *
 * @param {String=} defaultLang
 * @returns {String}
 */
export const getLang = (defaultLang?: string) =>
  (defaultLang || navigator.language).split("-")[0] === firstLang ? firstLang : secondLang;
