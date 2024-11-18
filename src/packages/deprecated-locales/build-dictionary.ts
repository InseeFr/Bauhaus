import appD from './dictionary/app';
import conceptsD from './dictionary/concepts';
import classificationsD from './dictionary/classifications';
import operationsD from './dictionary/operations';
import DSDsD from './dictionary/dsds';
import codelistsD from './dictionary/codelists';
import errors from './dictionary/errors';
import datasets from './dictionary/datasets';
import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from '@utils/dictionnary';

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
