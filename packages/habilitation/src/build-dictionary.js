import 'moment/locale/en-gb';
import 'moment/locale/fr';
import {
	createDictionary,
	firstLang,
	secondLang,
	getLang,
} from '@inseefr/ui';

const dictionary = {
	authorizationTitle: {
		fr: 'Habilitations',
		en: 'Authorizations',
	},
	pickedRolePlaceholder: {
		fr: 'Sélectionner un rôle...',
		en: 'Select a role...',
	},
	nameTitle: {
		fr: 'Nom',
		en: 'Name',
	},
	stampTitle: {
		fr: 'Timbre',
		en: 'Stamp',
	},
	roleTitle: {
		fr: 'Rôle',
		en: 'Role',
	},
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
