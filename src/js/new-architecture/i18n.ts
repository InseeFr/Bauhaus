import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from './utils/dictionnary';
import { Dictionary } from 'js/new-architecture/utils/types';

const dictionary = {
	authentication: {
		logout: {
			fr: 'Se déconnecter',
			en: 'Logout',
		},
		title: {
			fr: 'Habilitations',
			en: 'Authorizations',
		},
	},
};

export const D1: Dictionary = createDictionary(firstLang, dictionary);
export const D2: Dictionary = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
