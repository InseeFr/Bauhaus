import appD from './dictionary/app';
import conceptsD from './dictionary/concepts';
import classificationsD from './dictionary/classifications';
import operationsD from './dictionary/operations/index.js';
import DSDsD from './dictionary/dsds';
import codelistsD from './dictionary/codelists';

import {
	createDictionary,
	firstLang,
	secondLang,
	getLang,
} from '@inseefr/wilco';

const dictionary = {
	...appD,
	...conceptsD,
	...classificationsD,
	...operationsD,
	...DSDsD,
	...codelistsD,
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
