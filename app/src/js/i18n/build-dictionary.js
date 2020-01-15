import appD from './dictionary/app';
import conceptsD from './dictionary/concepts';
import classificationsD from './dictionary/classifications';
import operationsD from './dictionary/operations/index.js';
import DSDsD from './dictionary/dsds';
import bauhausLibrary from './dictionary/bauhaus-library.js';
import errorsD from './dictionary/errors.js';

import 'moment/locale/en-gb';
import 'moment/locale/fr';

const dictionary = {
	...appD,
	...conceptsD,
	...classificationsD,
	...operationsD,
	...DSDsD,
	...bauhausLibrary,
	...errorsD,
};

/**
 * Based on the locale passed as a paremeter, this function will return
 * the corresponding dictionary.
 *
 * @param {string} lang the lang of the user
 * @param {any} dict
 */
export const createDictionary = (lang, dict = dictionary) =>
	Object.keys(dict).reduce((acc, k) => {
		const hasChildObject = Object.keys(dict[k]).find(
			key =>
				dict[k][key] &&
				typeof dict[k][key] === 'object' &&
				dict[k][key].constructor === Object
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

const firstLang = 'fr';
const secondLang = 'en';

/**
 * Return the current lang based of the settings of the browser
 *
 * @param {String=} defaultLang
 * @returns {String}
 */
export const getLang = defaultLang =>
	(defaultLang || navigator.language || navigator.browserLanguage).split(
		'-'
	)[0] === firstLang
		? firstLang
		: secondLang;

/**
 * returns true if the current locale is the second one available in this application
 * @returns {Boolean}
 */
export const isLang2 = () => getLang() === secondLang;

/**
 *
 * @param {String} message the Key of the message we want to get
 * @returns {String} the corresponding message
 */
export const getMessageForSecondLang = message => {
	const secondLang = ['en', 'fr'].find(l => l !== getLang());
	return dictionary[message][secondLang];
};

export const D1 = createDictionary(firstLang);
export const D2 = createDictionary(secondLang);

export default getLang() === firstLang ? D1 : D2;
