import 'moment/locale/en-gb';
import 'moment/locale/fr';
import { createDictionary, firstLang, secondLang, getLang } from './i18n';
import ErrorsD from './errors';
const dictionary = {
	...ErrorsD,
	backToTop: {
		en: 'Back to Top',
		fr: 'Haut de page',
	},
	btnReturn: {
		fr: 'Retour',
		en: 'Back',
	},
	btnUpdate: {
		fr: 'Modifier',
		en: 'Update',
	},
	btnExport: {
		fr: 'Exporter',
		en: 'Export',
	},
	btnValid: {
		fr: 'Publier',
		en: 'Publish',
	},
	btnNewMale: {
		fr: 'Nouveau',
		en: 'New',
	},
	btnCancel: {
		fr: 'Annuler',
		en: 'Cancel',
	},
	btnSave: {
		fr: 'Sauvegarder',
		en: 'Save',
	},
	btnDuplicate: {
		fr: 'Dupliquer',
		en: 'Duplicate',
	},
	errorTitle: {
		fr: 'Erreur',
		en: 'Error',
	},
	// Loadable
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
	home: {
		fr: 'Accueil',
		en: 'Home',
	},
	pagination: {
		goTo: {
			en: 'Go to page',
			fr: 'Allez à la page',
		},
	},
	searchLabelPlaceholder: {
		fr: 'Libellé...',
		en: 'Label...',
	},
	advancedSearchTitle: {
		fr: 'Recherche avancée',
		en: 'Advanced search',
	},
	search: {
		fr: 'Recherchez...',
		en: 'Search...',
	},
	noResult: {
		fr: 'Aucun résultat',
		en: 'No results',
	},
	result: {
		fr: 'résultat',
		en: 'result',
	},
	results: {
		fr: 'résultats',
		en: 'results',
	},
	displayLg2: {
		fr: 'Afficher la seconde langue',
		en: 'Display second language',
	},
	noDataTitle: {
		fr: 'Aucune donnée',
		en: 'No data',
	},
	allTitle: {
		fr: 'Tous',
		en: 'All',
	},
	searchTablePlaceholder: {
		fr: 'Rechercher dans le tableau...',
		en: 'Search in the table...',
	},
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
