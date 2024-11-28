import documentsD from '../operations/documents';
import validationD from '../operations/validation';

const dictionary = {
	createFromAnExistingReport: {
		fr: "Créer à partir d'un rapport qualité existant",
		en: 'Create from an existing quality report',
	},
	operationsTitle: {
		fr: 'Opérations',
		en: 'Operations',
	},
	familyTitle: {
		fr: 'Famille',
		en: 'Family',
	},
	familiesTitle: {
		fr: 'Familles',
		en: 'Families',
	},
	serieTitle: {
		fr: 'Série',
		en: 'Serie',
	},
	seriesTitle: {
		fr: 'Séries',
		en: 'Series',
	},
	indicatorsTitle: {
		fr: 'Indicateurs',
		en: 'Indicators',
	},
	operationsCreateTitle: {
		fr: 'Créer une nouvelle opération',
		en: 'Create a new operation',
	},
	familiesCreateTitle: {
		fr: 'Créer une nouvelle famille',
		en: 'Create a new family',
	},
	documentsCreateTitle: {
		fr: 'Créer un nouveau document',
		en: 'Create a new document',
	},
	linksCreateTitle: {
		fr: 'Créer un nouveau lien',
		en: 'Create a new link',
	},
	seriesCreateTitle: {
		fr: 'Créer une nouvelle série',
		en: 'Create a new series',
	},
	indicatorsCreateTitle: {
		fr: 'Créer un nouvel indicateur',
		en: 'Create a new indicator',
	},
	operationsSearchTitle: {
		fr: 'Opérations - Recherche',
		en: 'Operations - Search',
	},
	familiesSearchTitle: {
		fr: 'Familles - Recherche',
		en: 'Families - Search',
	},
	seriesSearchTitle: {
		fr: 'Séries - Recherche',
		en: 'Series - Search',
	},
	indicatorsSearchTitle: {
		fr: 'Indicateurs - Recherche',
		en: 'Indicators - Search',
	},

	childrenSeries: {
		fr: 'Séries filles :',
		en: 'Daughter series:',
	},
	linkedSims: {
		fr: 'Sims associés :',
		en: 'Linked Sims:',
	},
	childrenOperations: {
		fr: 'Opérations filles :',
		en: 'Daughter operations:',
	},
	parentFamilly: {
		fr: 'Famille parente :',
		en: 'Parent family:',
	},
	parentSeries: {
		fr: 'Série parente :',
		en: 'Parent series:',
	},
	title: {
		fr: 'Intitulé',
		en: 'Title',
	},
	theme: {
		fr: 'Thème',
		en: 'Theme',
	},
	summary: {
		fr: 'Résumé',
		en: 'Summary',
	},
	history: {
		fr: 'Historique',
		en: 'History',
	},
	year: {
		fr: 'Millésime',
		en: 'Year',
	},
	dataCollector: {
		fr: 'Services collecteurs',
		en: 'Data collectors',
	},
	stakeholders: {
		fr: 'Partenaires',
		en: 'Stackeholders',
	},
	organisation: {
		fr: 'Organisme responsable',
		en: 'Legal owner',
	},
	indicatorDataCollectFrequency: {
		fr: 'Fréquence de diffusion',
		en: 'Frequency of dissemination',
	},
	dataCollectFrequency: {
		fr: 'Fréquence de collecte des données',
		en: 'Frequency of data collection',
	},
	operationType: {
		fr: "Type d'opération",
		en: 'Operation type',
	},
	replaces: {
		fr: 'Succède à',
		en: 'Replaces',
	},
	replacedBy: {
		fr: 'Est remplacée par',
		en: 'Is replaced by',
	},
	replacedByMasc: {
		fr: 'Est remplacé par',
		en: 'Is replaced by',
	},
	indicators: {
		fr: 'Indicateurs produits',
		en: 'Indicators produced',
	},
	seeAlso: {
		fr: 'Séries ou Indicateurs liés',
		en: 'Related series or indicators',
	},
	generatedBy: {
		fr: 'Produit de',
		en: 'Produced from',
	},
	helpContent: {
		en: 'Content',
		fr: 'Contenu',
	},
	helpSummary: {
		en: 'Summary',
		fr: 'Sommaire',
	},
	helpMaxOccurs: {
		en: 'Maximum of occurences',
		fr: "Maximum d'occurence",
	},
	helpRange: {
		en: 'Range',
		fr: 'Portée',
	},
	simsValue: {
		en: 'Value',
		fr: 'Valeur',
	},
	essentialRubric: {
		en: 'Essential rubrics',
		fr: 'Rubriques essentielles',
	},
	essentialRubricMsgPlural: {
		fr: (nb: number, total: number) =>
			`Vous avez rempli ${nb} rubriques essentielles sur ${total}.`,
		en: (nb: number, total: number) =>
			`You have completed ${nb} out of ${total} essential items.`,
	},
	essentialRubricMsg: {
		fr: (_nb: string, total: number) =>
			`Vous avez rempli 1 rubrique essentielle sur ${total}`,
		en: (_nb: string, total: number) =>
			`You have completed 1 out of ${total} essential items.`,
	},
	essentialRubricKo: {
		en: 'This rubric is an essantial rubric. You should define a value.',
		fr: 'Cette rubrique est une rubrique essentielle. Vous devriez lui définir une valeur',
	},
	essentialRubricOk: {
		en: 'This rubric is an essantial rubric',
		fr: 'Cette rubrique est une rubrique essentielle',
	},
	helpPresentational: {
		en: 'Presentational attribut',
		fr: 'Attribut présentationnel',
	},
	helpRICH_TEXT: {
		en: 'Rich text + URI',
		fr: 'Texte riche + URI',
	},
	helpTEXT: {
		en: 'Text',
		fr: 'Texte',
	},
	helpDATE: {
		en: 'Date',
		fr: 'Date',
	},
	helpCODE_LIST: {
		en: 'Code list',
		fr: 'Liste de codes',
	},
	helpORGANIZATION: {
		en: 'Organization',
		fr: 'Organisation',
	},
	btnSimsVisu: {
		en: 'Show the report',
		fr: 'Voir le rapport',
	},
	btnSimsCreate: {
		en: 'Create the report',
		fr: 'Créer le rapport',
	},
	simsTitle: {
		fr: 'Rapport qualité : ',
		en: 'Quality report: ',
	},
	operationsTreeTitle: {
		fr: 'Arbre des Opérations',
		en: 'Operations tree',
	},
	familyStatus: {
		fr: 'État de la famille',
		en: 'State of the family',
	},
	seriesStatus: {
		fr: 'État de la série',
		en: 'State of the series',
	},
	operationStatus: {
		fr: "État de l'opération",
		en: 'State of the operation',
	},
	indicatorStatus: {
		fr: "État de l'indicateur",
		en: 'State of the indicator',
	},
	simsStatus: {
		fr: 'État du SIMS',
		en: 'State of the SIMS',
	},
	confirmationDocumentationDelete: {
		fr: 'Vous êtes sur le point de supprimer définitivement cette documentation. Êtes-vous sûr ?',
		en: 'You are about to permanently delete this documentation. Are you sure?',
	},
	exportSimsTips: {
		fr: "Veuillez sélectionner les options d'export",
		en: 'Please select the export options',
	},
	exportSimsIncludeLg1: {
		fr: 'Inclure la première langue',
		en: 'Include first language',
	},
	exportSimsIncludeLg2: {
		fr: 'Inclure la seconde langue',
		en: 'Include second language',
	},
	exportLgTitle: {
		fr: 'Selectionnez la langue ',
		en: 'Select the	 language',
	},
	exportLg1: {
		fr: 'Première langue',
		en: 'First language',
	},
	exportLg2: {
		fr: 'Seconde langue',
		en: 'Second language',
	},
	exportConcepts: {
		fr: 'Exporter les concepts',
		en: 'Export concepts',
	},
	exportDocument: {
		fr: 'Exporter les documents',
		en: 'Export documents',
	},
	exportSimsIncludeEmptyMas: {
		fr: 'Inclure les rubriques vides',
		en: 'Include the empty rubrics',
	},
	...documentsD,
	...validationD,
};

export default dictionary;
