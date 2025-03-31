import btnD from './generic/btn';

const dictionary = {
	errorTitle: { fr: 'Erreur', en: 'Error' },
	langs: {
		fr: 'Français',
		en: 'English',
	},
	help: {
		fr: 'Aide',
		en: 'Help',
	},
	display: {
		fr: 'Afficher',
		en: 'Display',
	},
	hide: {
		fr: 'Cacher',
		en: 'Hide',
	},
	administrationTitle: {
		fr: 'Administration',
		en: 'Administration',
	},
	confirmation: {
		fr: 'Confirmation',
		en: 'Confirm',
	},
	warningDocumentWithSimsPrefix: {
		fr: 'Ce document est déjà utilisé dans les Sims suivants',
		en: 'This document is already used by the following sims',
	},
	warningDocumentLinksWithSimsSuffix: {
		fr: 'Si vous cliquez sur "Oui", il sera définitivement modifié dans tous les Sims associés. Voulez-vous continuer ?',
		en: 'If you click on "Yes", it will be modified on the linked Sims. Do you want to continue?',
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
	requiredFields: {
		fr: 'Champs requis',
		en: 'Required fields',
	},
	version: {
		fr: 'Version',
		en: 'Version',
	},

	langTitle: {
		fr: 'Langue',
		en: 'Language',
	},
	notFoundTitle: {
		fr: 'Page introuvable',
		en: 'Page not found',
	},
	underMaintenanceTitle: {
		fr: 'En maintenance',
		en: 'Under maintenance',
	},

	errorBody: {
		fr: "Veuillez contacter l'équipe RMéS dg75-administration-rmes@insee.fr",
		en: 'Please contact the team RMéS dg75-administration-rmes@insee.fr',
	},
	exportTitle: {
		fr: 'Export',
		en: 'Export',
	},
	identifiantTitle: {
		fr: 'Identifiant',
		en: 'Identifier',
	},
	labelTitle: {
		fr: 'Libellé',
		en: 'Label',
	},
	search: {
		fr: 'Recherchez...',
		en: 'Search...',
	},
	searchLabelPlaceholder: {
		fr: 'Libellé...',
		en: 'Label...',
	},
	searchLabelHomePlaceholder: {
		fr: 'Libellé (ou libellé alternatif)...',
		en: 'Label (or alternative label)...',
	},

	altLabelTitle: {
		fr: 'Libellé alternatif',
		en: 'Alternative label',
	},
	altLabel: {
		fr: 'Nom court',
		en: 'Short name',
	},
	searchAltLabelPlaceholder: {
		fr: 'Libellé alternatif...',
		en: 'Alternative label...',
	},
	descriptionTitle: {
		fr: 'Description',
		en: 'Description',
	},
	searchDefinitionPlaceholder: {
		fr: 'Rechercher dans la définition...',
		en: 'Search in the definition ...',
	},
	validationStatusPlaceholder: {
		fr: 'Sélectionnez le statut de publication...',
		en: 'Select publication status...',
	},
	creatorsTitle: {
		fr: 'Propriétaires',
		en: 'Owners',
	},
	creatorTitle: {
		fr: 'Propriétaire',
		en: 'Owner',
	},
	contributorsTitle: {
		fr: 'Gestionnaires',
		en: 'Contributors',
	},
	contributorTitle: {
		fr: 'Gestionnaire',
		en: 'Contributor',
	},
	disseminationStatusTitle: {
		fr: 'Statut de diffusion',
		en: 'Dissemination status',
	},
	stampsPlaceholder: {
		fr: 'Sélectionnez un timbre...',
		en: 'Select stamp...',
	},
	additionalMaterialTitle: {
		fr: 'Document lié',
		en: 'Additional material',
	},
	creationsTitle: {
		fr: 'créations',
		en: 'creations',
	},
	modificationsTitle: {
		fr: 'modifications',
		en: 'modifications',
	},
	createdDateTitle: {
		fr: 'Date de création',
		en: 'Creation date',
	},
	modifiedDateTitle: {
		fr: 'Date de modification',
		en: 'Modification date',
	},
	validDateTitle: {
		fr: 'Date de fin de validité',
		en: 'Expiration date',
	},
	issuedDateTitle: {
		fr: "Date légale d'entrée en vigueur",
		en: 'Legal start date',
	},
	lastRefreshedOnDateTitle: {
		fr: 'Date de dernière mise à jour',
		en: 'Last update',
	},
	rightsTitle: {
		fr: "Droit d'auteur",
		en: 'Copyright',
	},
	legalMaterialTitle: {
		fr: 'Textes légaux',
		en: 'Legal material',
	},
	homepageTitle: {
		fr: 'Url de diffusion de la nomenclature',
		en: 'Classification diffusion Url',
	},
	duplicatedId: {
		fr: "L'identifiant choisi existe déjà",
		en: 'This identifier already exists',
	},
	duplicatedLabel: {
		fr: 'Le libellé choisi existe déjà',
		en: 'This label already exists',
	},
	duplicatedTitle: {
		fr: "L'intitulé choisi existe déjà",
		en: 'This title already exists',
	},
	globalInformationsTitle: {
		fr: 'Informations générales',
		en: 'General information',
	},
	internalManagementTitle: {
		fr: 'Gestion Interne',
		en: 'Internal management',
	},
	notesTitle: {
		fr: 'Notes',
		en: 'Notes',
	},
	linksTitle: {
		fr: 'Liens',
		en: 'Links',
	},
	...btnD,
	// Links
	narrowerTitle: {
		fr: 'A pour enfant',
		en: 'Has child',
	},
	broaderTitle: {
		fr: 'A pour parent',
		en: 'Has parent',
	},
	referencesTitle: {
		fr: 'Référence',
		en: 'References',
	},
	replacesTitle: {
		fr: 'Remplace',
		en: 'Replaces',
	},
	relatedTitle: {
		fr: 'Est lié à',
		en: 'Is related to',
	},
	equivalentTitle: {
		fr: 'Correspond à',
		en: 'Matches',
	},
	// Export
	exportModalTitle: {
		fr: "Veuillez sélectionner le type d'export",
		en: 'Please select export type',
	},
	exportModalBody: {
		fr: `Les ODT sont modifiables sous LibreOffice.`,
		en: `ODT files can be modified with LibreOffice.`,
	},
	// Pagination
	paginationFirst: {
		fr: 'Début',
		en: 'First',
	},
	paginationLast: {
		fr: 'Fin',
		en: 'Last',
	},
	// Auth

	pickedRolePlaceholder: {
		fr: 'Sélectionner un rôle...',
		en: 'Select a role...',
	},

	dashboardTitle: {
		fr: 'Tableau de bord',
		en: 'Dashboard',
	},
	dashboardSummaryTitle: {
		fr: 'Récapitulatif',
		en: 'Summary',
	},
	dashboardCreationListTitle: {
		fr: 'Liste des créations',
		en: 'Creation list',
	},
	dashboardModificationListTitle: {
		fr: 'Liste des modifications',
		en: 'Modification list',
	},
	totalTitle: {
		fr: 'Total',
		en: 'Total',
	},
	DSPublicGeneriqueTitle: {
		fr: 'Public générique',
		en: 'Public generic',
	},
	DSPublicSpecifiqueTitle: {
		fr: 'Public spécifique',
		en: 'Public specific',
	},
	DSPrivateTitle: {
		fr: 'Privé',
		en: 'Private',
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
	quitWithoutSaving: {
		fr: 'Vous êtes sur le point de quitter cette page sans sauvegarder vos modifications. Souhaitez-vous continuer ?',
		en: 'You are leaving this page without saving your changes. Do you want to continue ?',
	},
	btnExport: { fr: "Options d'export", en: 'Export options' },
	btnOdsExporter: {
		fr: 'Exporter en ODS',
		en: 'Export as ODS',
	},
	btnOdtLg1Exporter: {
		fr: 'Exporter en ODT (Première langue)',
		en: 'Export as ODT (First language)',
	},
	btnOdtLg2Exporter: {
		fr: 'Exporter en ODT (Seconde langue)',
		en: 'Export as ODT (Second language)',
	},
	btnCollectionConceptExporter: {
		fr: 'Exporter les fiches des concepts de la sélection',
		en: 'Export the concepts of the selected collections',
	},
	btnExportValidate: { fr: 'Exporter en odt', en: 'Export to odt' },

	advancedSearch: { fr: 'Recherche avancée', en: 'Advanced search' },
	type: {
		fr: 'Type',
		en: 'Type',
	},
	year: {
		fr: 'Millésime',
		en: 'Year',
	},
	numberProperty: {
		fr: (propertyName: string) =>
			`La propriété <strong>${propertyName}</strong> doit être un entier.`,
		en: (propertyName: string) =>
			`The property <strong>${propertyName}</strong> must be an integer.`,
	},
};

export default dictionary;
