import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from './utils/dictionnary';
import { Dictionary } from '../new-architecture/utils/types';

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
	validationState: {
		validated: {
			m: {
				fr: 'Publié',
				en: 'Published',
			},
			f: {
				fr: 'Publiée',
				en: 'Published',
			},
		},
		modified: {
			m: {
				fr: 'Provisoire, déjà publié',
				en: 'Temporary, already published',
			},
			f: {
				fr: 'Provisoire, déjà publiée',
				en: 'Temporary, already published',
			},
		},
		unpublished: {
			m: {
				fr: 'Provisoire, jamais publié',
				en: 'Temporary, never published',
			},
			f: {
				fr: 'Provisoire, jamais publiée',
				en: 'Temporary, never published',
			},
		},
	},
};

export const D1: Dictionary = createDictionary(firstLang, dictionary);
export const D2: Dictionary = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
