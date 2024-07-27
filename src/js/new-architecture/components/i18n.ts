import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from '../../new-architecture/utils/dictionnary';
import { Dictionary } from '../../new-architecture/utils/types';

const dictionary = {
	btnNew: {
		masculine: {
			fr: 'Nouveau',
			en: 'New',
		},
		feminine: {
			fr: 'Nouvelle',
			en: 'New',
		},
	},
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
	creatorsInput: {
		creatorsTitle: {
			fr: 'Propriétaires',
			en: 'Owners',
		},
		creatorTitle: {
			fr: 'Propriétaire',
			en: 'Owner',
		},
	},
	contributors: {
		title: {
			fr: 'Gestionnaire',
			en: 'Contributor',
		},
		stampsPlaceholder: {
			fr: 'Sélectionnez un timbre...',
			en: 'Select stamp...',
		},
	},
};

export const D1: Dictionary = createDictionary(firstLang, dictionary);
export const D2: Dictionary = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
