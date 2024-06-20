import dictionary from './dictionary';

import {
	createDictionary,
	firstLang,
	secondLang,
	getLang,
} from 'js/new-architecture/utils/dictionnary';

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);
const D = getLang() === firstLang ? D1 : D2;

export default D;
