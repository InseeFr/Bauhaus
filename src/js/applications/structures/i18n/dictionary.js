import errors from './errors';
import component from './component';

const dictionary = {
	...errors,
	...component,
	altLabel: {
		fr: 'Nom court',
		en: 'Short name',
	},
	btnCancel: {
		fr: 'Annuler',
		en: 'Cancel',
	},
	creatorTitle: {
		fr: 'Propriétaire',
		en: 'Owner',
	},
	contributorTitle: {
		fr: 'Gestionnaire',
		en: 'Contributor',
	},
	stampsPlaceholder: {
		fr: 'Sélectionnez un timbre...',
		en: 'Select stamp...',
	},
	disseminationStatusPlaceholder: {
		fr: 'Sélectionnez un statut de diffusion...',
		en: 'Select dissemination status...',
	},
	componentSpecificationTitle: {
		fr: 'Spécification du Composant',
		en: 'Component Specification',
	},
	errorsIdMandatory: {
		fr: "L'identifiant est obligatoire",
		en: 'The id is mandatory',
	},
	errorsLabelLg1Mandatory: {
		fr: 'Le label est obligatoire',
		en: 'The label is mandatory',
	},
	errorsConceptMandatory: {
		fr: 'Le concept est obligatoire',
		en: 'The concept is mandatory',
	},
	errorsRangeMandatory: {
		fr: 'La représentation est obligatoire',
		en: 'The representation is mandatory',
	},
	componentTitle: {
		fr: 'Composants',
		en: 'Components',
	},
	componentHomePageTitle: {
		fr: 'Composants - Recherche',
		en: 'Components - Search',
	},
	addComponentTitle: {
		fr: 'Ajouter un composant',
		en: 'Add a component',
	},
	mutualizedComponentTitle: {
		fr: 'Composants mutualisés',
		en: 'Mutualized Components',
	},
	label: {
		fr: 'Libellé',
		en: 'Label',
	},
	mutualized: {
		fr: 'Publié',
		en: 'Published',
	},
	componentLabel: {
		fr: 'Libellé du composant',
		en: 'Component label',
	},
	type: {
		fr: 'Type',
		en: 'Type',
	},
	add: {
		fr: 'Ajouter',
		en: 'Add',
	},
	see: {
		fr: 'Voir',
		en: 'See',
	},
	remove: {
		fr: 'Supprimer',
		en: 'Remove',
	},
	up: {
		fr: 'Monter',
		en: 'Up',
	},
	down: {
		fr: 'Descendre',
		en: 'Down',
	},
	Attribute: {
		fr: 'Attribut',
		en: 'Attribute',
	},
	Dimension: {
		fr: 'Dimension',
		en: 'Dimension',
	},
	Measure: {
		fr: 'Mesure',
		en: 'Measure',
	},
	Value: {
		fr: 'Valeur',
		en: 'Value',
	},
	AttributePlural: {
		fr: 'Attributs',
		en: 'Attributes',
	},
	DimensionPlural: {
		fr: 'Dimensions',
		en: 'Dimensions',
	},
	MeasurePlural: {
		fr: 'Mesures',
		en: 'Measures',
	},
	formatTitle: {
		fr: 'Format',
		en: 'Format',
	},
	regexpTitle: {
		fr: 'Expression régulière',
		en: 'Regular Expression',
	},
	minLength: {
		fr: 'Longueur minimale',
		en: 'Minimal size',
	},
	maxLength: {
		fr: 'Longueur maximale',
		en: 'Minimal size',
	},
	minInclusive: {
		fr: 'Valeur minimale',
		en: 'Minimal value',
	},
	maxInclusive: {
		fr: 'Valeur maximale',
		en: 'Minimal value',
	},
	constraints: {
		fr: 'Contraintes',
		en: 'Constraints',
	},
	codesListTitle: {
		en: 'Code list',
		fr: 'Liste de codes',
	},
	representationTitle: {
		en: 'Representation',
		fr: 'Représentation',
	},
	conceptTitle: {
		en: 'Concept',
		fr: 'Concept',
	},
	rangeTitle: {
		fr: 'Représentation',
		en: 'Representation',
	},
	stringType: {
		fr: 'Texte',
		en: 'String',
	},
	floatType: {
		fr: 'Nombre décimal',
		en: 'Float',
	},
	intType: {
		fr: 'Nombre entier',
		en: 'Integer',
	},
	dateType: {
		fr: 'Date',
		en: 'Date',
	},
	dateTimeType: {
		fr: 'Date et heure',
		en: 'Date and hour',
	},
	paysOuTerritoire: {
		fr: 'Pays ou territoire',
		en: 'Country or territory',
	},
	idTitle: {
		fr: 'Notation',
		en: 'Notation',
	},
	attachmentTitle: {
		fr: "Attachement de l'attribut",
		en: 'Attribute attachment',
	},
	requiredSpecificationTitle: {
		fr: 'Le composant est-il obligatoire ?',
		en: 'Is this component required ? ',
	},
	yes: {
		fr: 'Oui',
		en: 'Yes',
	},
	no: {
		fr: 'Non',
		en: 'No',
	},
	structuresComponentTitle: {
		fr: 'Structures utilisant le composant',
		en: 'Structure using the component',
	},
	descriptionTitle: {
		fr: 'Description',
		en: 'Description',
	},
	componentsSearchTitle: {
		fr: 'Composants - Recherche',
		en: 'Components - Search',
	},
	structuresSearchTitle: {
		fr: 'Structures - Recherche',
		en: 'Structures - Search',
	},
	all: {
		fr: 'Tous',
		en: 'All',
	},
	globalInformationsTitle: {
		fr: 'Informations générales',
		en: 'General information',
	},
	modifiedDateTitle: {
		fr: 'Date de modification',
		en: 'Modification date',
	},
	componentValididationStatusTitle: {
		fr: 'État du composant',
		en: 'Publication status',
	},
	contributor: {
		fr: 'Gestionnaire',
		en: 'Contributor',
	},
	creator: {
		fr: 'Propriétaires',
		en: 'Creator',
	},
	seeCodesListDetails: {
		fr: 'Voir les codes de cette liste',
		en: 'see codes of this list',
	},
	statusValidatedM: {
		fr: 'Publié',
		en: 'Published',
	},
	statusValidatedF: {
		fr: 'Publiée',
		en: 'Published',
	},
	statusModifiedM: {
		fr: 'Provisoire, déjà publié',
		en: 'Temporary, already published',
	},
	statusModifiedF: {
		fr: 'Provisoire, déjà publiée',
		en: 'Temporary, already published',
	},
	statusUnpublishedM: {
		fr: 'Provisoire, jamais publié',
		en: 'Temporary, never published',
	},
	statusUnpublishedF: {
		fr: 'Provisoire, jamais publiée',
		en: 'Temporary, never published',
	},
	structuresTitle: { fr: 'Structures', en: 'Structures' },
	structuresAdvancedSearch: { fr: 'Recherche Avancée', en: 'Advanced Search' },
	componentsCreateTitle: {
		fr: 'Créer un nouveau composant',
		en: 'Create a new component',
	},
};
export default dictionary;
