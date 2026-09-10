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

export const isLang2 = () => getLang() === secondLang;
