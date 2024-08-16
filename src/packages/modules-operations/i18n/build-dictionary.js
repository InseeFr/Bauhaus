import dictionary from './dictionary';

import {
	createDictionary,
	firstLang,
	secondLang,
	getLang,
} from '../../utils/dictionnary';

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
