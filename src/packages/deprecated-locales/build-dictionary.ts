import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from '@utils/dictionnary';

import appD from './dictionary/app';
import classificationsD from './dictionary/classifications';
import codelistsD from './dictionary/codelists';
import conceptsD from './dictionary/concepts';
import datasets from './dictionary/datasets';
import DSDsD from './dictionary/dsds';
import errors from './dictionary/errors';
import operationsD from './dictionary/operations';

const dictionary = {
	...appD,
	...conceptsD,
	...classificationsD,
	...operationsD,
	...DSDsD,
	...codelistsD,
	...errors,
	...datasets,
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
