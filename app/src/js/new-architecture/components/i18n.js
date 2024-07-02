import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from 'js/new-architecture/utils/dictionnary';

const dictionary = {
	loading: {
		auth: {
			fr: 'Authentification en cours...',
			en: 'Authentication in progress...',
		},
		saving: {
			fr: 'Sauvegarde en cours...',
			en: 'Saving in progress...',
		},
		sending: {
			fr: 'Envoi en cours...',
			en: 'Sending in progress...',
		},
		exporting: {
			fr: 'Export en cours...',
			en: 'Export in progress...',
		},
		validating: {
			fr: 'Publication en cours ...',
			en: 'Publish in progress ...',
		},
		loading: {
			fr: 'Chargement en cours...',
			en: 'Loading in progress...',
		},
		deleting: {
			fr: 'Suppression en cours...',
			en: 'Deleting in progress...',
		},
	},
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
