import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from './utils/dictionnary';

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

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
