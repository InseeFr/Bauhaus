import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from '@inseefr/wilco';

const dictionary = {
	loadableAuth: {
		fr: 'Authentification en cours...',
		en: 'Authentication in progress...',
	},
	loadableSaving: {
		fr: 'Sauvegarde en cours...',
		en: 'Saving in progress...',
	},
	loadableSending: {
		fr: 'Envoi en cours...',
		en: 'Sending in progress...',
	},
	loadableExporting: {
		fr: 'Export en cours...',
		en: 'Export in progress...',
	},
	loadableValidating: {
		fr: 'Publication en cours ...',
		en: 'Publish in progress ...',
	},
	loadableLoading: {
		fr: 'Chargement en cours...',
		en: 'Loading in progress...',
	},
	loadableDeleting: {
		fr: 'Suppression en cours...',
		en: 'Deleting in progress...',
	},
};

export type Dictionary = Record<string, string>;

export const D1: Dictionary = createDictionary(firstLang, dictionary);
export const D2: Dictionary = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
