const dictionary = {
  classificationsTitle: {
    fr: "Nomenclatures",
    en: "Classifications",
  },
  correspondencesTitle: {
    fr: "Tables de correspondances",
    en: "Correspondences",
  },
  classificationsSearchTitle: {
    fr: "Nomenclatures - Recherche",
    en: "Classifications - Search",
  },
  correspondencesSearchTitle: {
    fr: "Tables de correspondances - Recherche",
    en: "Correspondences - Search",
  },
  classificationsScopeNote: {
    fr: "Remarque",
    en: "Remark",
  },
  classificationsDefinition: {
    fr: "Note générale",
    en: "General note",
  },
  classificationsCoreContentNote: {
    fr: "Contenu central",
    en: "Main content",
  },
  classificationsAdditionalContentNote: {
    fr: "Contenu limite",
    en: "Additional content",
  },
  classificationsExclusionNote: {
    fr: "Note d'exclusions",
    en: "Exclusion note",
  },
  classificationsChangeNote: {
    fr: (d: string) => (d ? `Note de changement - ${d}` : `Note de changement`),
    en: (d: string) => (d ? `Change note - ${d}` : `Change note`),
  },
  classificationsDescription: {
    fr: "Texte descriptif court",
    en: "Short descriptive text",
  },
  childrenSeries: {
    fr: "Séries filles",
    en: "Daughter series",
  },
  childrenClassifications: {
    fr: "Nomenclatures filles",
    en: "Daughter classifications",
  },
  childrenClassificationItems: {
    fr: "Postes du niveau",
    en: "Level items",
  },
  motherFamily: {
    fr: "Famille mère",
    en: "Mother family",
  },
  motherSeries: {
    fr: "Série mère",
    en: "Mother series",
  },
  classificationAllItemsTitle: {
    fr: "Ensemble des postes",
    en: "All items",
  },
  classificationLevelsTitle: {
    fr: "Niveaux de la nomenclature",
    en: "Classification levels",
  },
  classificationsSubjectTitle: {
    fr: "Mots clés",
    en: "Key words",
  },
  classificationsPublisherTitle: {
    fr: "Responsable légal",
    en: "Legal responsible",
  },
  classificationsCoversTitle: {
    fr: "Thèmes couverts",
    en: "Covered topics",
  },
  classificationsAfterTitle: {
    fr: "Nomenclature précédente",
    en: "Previous classification",
  },
  classificationsBeforeTitle: {
    fr: "Nomenclature suivante",
    en: "Following classification",
  },
  classificationsVariantTitle: {
    fr: "Variante",
    en: "Variant",
  },
  classificationsBroaderLevel: {
    fr: "Niveau supérieur",
    en: "Broader level",
  },
  classificationsNarrowerLevel: {
    fr: "Niveau inférieur",
    en: "Narrower level",
  },
  classificationsNotationTitle: {
    fr: "Code",
    en: "Code",
  },
  classificationsDepthTitle: {
    fr: "Profondeur",
    en: "Depth",
  },
  classificationsNotationPatternTitle: {
    fr: "Structure des codes du niveau",
    en: "Level item codes pattern",
  },
  classificationsNarrowerItems: {
    fr: "Niveaux inférieurs",
    en: "Narrower items",
  },
  sourceClassificationTitle: {
    fr: "Nomenclature source",
    en: "Source classification",
  },
  targetClassificationTitle: {
    fr: "Nomenclature cible",
    en: "Target classification",
  },
  sourceItemTitle: {
    fr: "Poste source",
    en: "Source item",
  },
  targetItemTitle: {
    fr: "Poste cible",
    en: "Target item",
  },
  associationsTitle: {
    fr: "Liste des associations",
    en: "Association list",
  },
  classificationItemAltLabels: {
    fr: (length: number) => `Titre abrégé (${length})`,
    en: (length: number) => `Short title (${length})`,
  },
  classificationItemAltError: {
    fr: (length: number) =>
      `Le titre abrégé (${length}) doit contenir maximum ${length} caractères`,
    en: (length: number) => `The short title (${length}) should contain ${length} characters max`,
  },
  classificationConceptVersionTitle: {
    fr: "Version du poste",
    en: "Item version",
  },
  isClassificationItemValidTitle: {
    fr: "État du poste",
    en: "State of the item",
  },
  classificationItemIsValidated: {
    fr: (bool: boolean) => `${bool ? "Validé" : "Provisoire"}`,
    en: (bool: boolean) => `${bool ? "Validated" : "Provisional"}`,
  },
  classificationTreeTitle: {
    fr: "Arbre de la nomenclature",
    en: "Classification tree",
  },
  additionalMaterialHttp: {
    fr: "Le document lié doit être une URL",
    en: "Additional material must be an URL",
  },
  legalMaterialHttp: {
    fr: "Les textes légaux doivent être une URL",
    en: "Legal material must be an URL",
  },
  homepageHttp: {
    fr: "L'Url de diffusion de la nomenclature doit être une URL",
    en: "The Classification diffusion Url must be an URL",
  },
};

export default dictionary;
