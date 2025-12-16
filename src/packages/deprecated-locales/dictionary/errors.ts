const messages = {
  errors: {
    "406_OPERATION_DOCUMENT_OPERATION_DOCUMENT_LINK_EXISTING_LABEL_LG1": {
      fr: () =>
        "La propriété <strong>Intitulé</strong> est déjà utilisée par un autre document ou lien.",
      en: () =>
        "The <strong>Intitulé</strong> property is already used by another document or link.",
    },
    "406_OPERATION_DOCUMENT_OPERATION_DOCUMENT_LINK_EXISTING_LABEL_LG2": {
      fr: () =>
        "La propriété <strong>Title</strong> est déjà utilisée par un autre document ou lien.",
      en: () => "The <strong>Title</strong> property is already used by another document or link.",
    },
    "406_OPERATION_FAMILY_OPERATION_FAMILY_EXISTING_PREF_LABEL_LG1": {
      fr: () => "La propriété <strong>Intitulé</strong> est déjà utilisée par une autre famille.",
      en: () => "The <strong>Intitulé</strong> property is already used by another family.",
    },
    "406_OPERATION_FAMILY_OPERATION_FAMILY_EXISTING_PREF_LABEL_LG2": {
      fr: () => "La propriété <strong>Title</strong> est déjà utilisée par une autre famille.",
      en: () => "The <strong>Title</strong> property is already used by another family.",
    },

    "406_OPERATION_SERIES_OPERATION_SERIES_EXISTING_PREF_LABEL_LG1": {
      fr: () => "La propriété <strong>Intitulé</strong> est déjà utilisée par une autre série.",
      en: () => "The <strong>Intitulé</strong> property is already used by another series.",
    },
    "406_OPERATION_SERIES_OPERATION_SERIES_EXISTING_PREF_LABEL_LG2": {
      fr: () => "La propriété <strong>Title</strong> est déjà utilisée par une autre série.",
      en: () => "The <strong>Title</strong> property is already used by another series.",
    },

    "406_OPERATION_OPERATION_OPERATION_OPERATION_EXISTING_PREF_LABEL_LG1": {
      fr: () => "La propriété <strong>Intitulé</strong> est déjà utilisée par une autre opération.",
      en: () => "The <strong>Intitulé</strong> property is already used by another operation.",
    },
    "406_OPERATION_OPERATION_OPERATION_OPERATION_EXISTING_PREF_LABEL_LG2": {
      fr: () => "La propriété <strong>Title</strong> est déjà utilisée par une autre opération.",
      en: () => "The <strong>Title</strong> property is already used by another operation.",
    },

    "406_OPERATION_INDICATOR_OPERATION_INDICATOR_EXISTING_PREF_LABEL_LG1": {
      fr: () => "La propriété <strong>Intitulé</strong> est déjà utilisée par un autre indicateur.",
      en: () => "The <strong>Intitulé</strong> property is already used by another indicator.",
    },
    "406_OPERATION_INDICATOR_OPERATION_INDICATOR_EXISTING_PREF_LABEL_LG2": {
      fr: () => "La propriété <strong>Title</strong> est déjà utilisée par un autre indicateur.",
      en: () => "The <strong>Title</strong> property is already used by another indicator.",
    },
    OPERATION_INDICATOR_VALIDATION_UNVALIDATED_SERIES: {
      fr: () =>
        "Un indicateur ne peut être publié si et seulement si les séries associées le sont également.",
      en: () =>
        "An indicator can be published if and only if all parent series has been published.",
    },
    101: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’un concept. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating a concept. For more information, please contact the management team.",
    },
    102: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’un concept. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing a concept. For more information, please contact the management team.",
    },
    103: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la publication d’un concept. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for publishing a concept. For more information, please contact the management team.",
    },
    104: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour l’envoi d’un concept. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for mailing a concept. For more information, please contact the management team.",
    },
    111: {
      fr: ({ idConcept }: { idConcept: string }) =>
        `Le concept ${idConcept} ne peut pas être supprimé car il est utilisé dans d’autres graphes.`,
      en: ({ idConcept }: { idConcept: string }) =>
        `The concept ${idConcept} can not be deleted because it is used in different graphs.`,
    },
    112: {
      fr: ({ idConcept }: { idConcept: string }) =>
        `Le concept ${idConcept} ne peut pas être supprimé car il est lié à d’autres concepts.`,
      en: ({ idConcept }: { idConcept: string }) =>
        `The concept ${idConcept} can not be deleted because it is used in different graphs.`,
    },
    141: {
      fr: () => "Le concept n’existe pas.",
      en: () => "The concept does not exist.",
    },
    201: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’un indicateur. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating an indicator. For more information, please contact the management team.",
    },
    202: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’un indicateur. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing an indicator. For more information, please contact the management team.",
    },
    203: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la publication d’un indicateur. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for publishing an indicator. For more information, please contact the management team.",
    },
    241: {
      fr: () => "L’indicateur n’existe pas.",
      en: () => "The indicator does not exist.",
    },
    301: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’un document. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating a document. For more information, please contact the management team.",
    },
    302: {
      fr: () =>
        "Le nom de fichier existe déjà. Merci de réutiliser le fichier existant ou choisir un autre nom de fichier.",
      en: () =>
        "The file name already exists. Please, reuse the existing document or choose another file name.",
    },
    303: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’un document. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing a document. For more information, please contact the management team.",
    },
    304: {
      fr: () => "DOCUMENT_DELETION_LINKED",
      en: () => "DOCUMENT_DELETION_LINKED",
    },
    341: {
      fr: () => "Le document n’existe pas.",
      en: () => "The document does not exist.",
    },
    361: {
      fr: () => "Le nom du fichier est vide. Merci de renseigner un nom de fichier.",
      en: () => "The file name is empty. Please, fill a file name.",
    },
    362: {
      fr: () =>
        "Le nom du fichier est incorrect. Il peut contenir des caractères alphanumériques (hors caractères accentués), des tirets et des tirets bas.",
      en: () =>
        "The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols.",
    },
    401: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’un lien. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating a link. For more information, please contact the management team.",
    },
    403: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’un lien. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing a link. For more information, please contact the management team.",
    },
    441: {
      fr: () => "Le lien n’existe pas.",
      en: () => "The link does not exist.",
    },
    461: {
      fr: () => "L’URL est vide. Merci de renseigner une URL.",
      en: () => "The URL is empty. Please, fill a URL.",
    },
    462: {
      fr: () => "L’URL existe déjà. Merci de réutiliser le lien existant ou choisir une autre URL.",
      en: () => "The URL already exists. Please, reuse the existing link or choose another URL.",
    },
    501: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’une famille. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating a family. For more information, please contact the management team.",
    },
    502: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’une famille. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing a family. For more information, please contact the management team.",
    },
    503: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la publication d’une famille. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for publishing a family. For more information, please contact the management team.",
    },
    541: {
      fr: () => "La famille n’existe pas.",
      en: () => "The family does not exist.",
    },
    542: {
      fr: () => "FAMILY_INCORRECT_BODY",
      en: () => "FAMILY_INCORRECT_BODY",
    },
    601: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’une série. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating a series. For more information, please contact the management team.",
    },
    602: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’une série. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing a series. For more information, please contact the management team.",
    },
    603: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la publication d’une série. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for publishing a series. For more information, please contact the management team.",
    },
    604: {
      fr: () => "Pour publier la série, vous devez au préalable publier sa famille.",
      en: () => "To publish the series, you must first publish its family.",
    },
    641: {
      fr: () => "La série n’existe pas.",
      en: () => "The series does not exist.",
    },
    644: {
      fr: () => "La famille référencée n’existe pas.",
      en: () => "The referenced family does not exist.",
    },
    663: {
      fr: () => "Une série ne peut avoir à la fois une documentation Sims et des opérations.",
      en: () => "A series can not have both Sims documentation and operations.",
    },
    701: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’une opération. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating an operation. For more information, please contact the management team.",
    },
    702: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’une opération. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing an operation. For more information, please contact the management team.",
    },
    703: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la publication d’une opération. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for publishing an operation. For more information, please contact the management team.",
    },
    704: {
      fr: () => "Pour publier l’opération, vous devez au préalable publier sa série.",
      en: () => "To publish the operation, you must first publish its series.",
    },
    741: {
      fr: () => "L’opération n’existe pas.",
      en: () => "The operation does not exist.",
    },
    744: {
      fr: () => "La série référencée n’existe pas.",
      en: () => "The referenced series does not exist.",
    },
    801: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’une documentation Sims. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating a Sims documentation. For more information, please contact the management team.",
    },
    802: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’une documentation Sims. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing a Sims documentation. For more information, please contact the management team.",
    },
    803: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la publication d’une documentation Sims. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for publishing a Sims documentation. For more information, please contact the management team.",
    },
    804: {
      fr: () =>
        "Vous ne pouvez pas publier cet objet (rapport, opération ou indicateur) sans avoir publié l’objet auquel il est rattaché (opération ou indicateur, série)",
      en: () =>
        "You cannot publish this object (report, operation, or indicator) without first publishing the object it is attached to (operation or indicator, series)",
    },
    841: {
      fr: () => "La documentation Sims n’existe pas.",
      en: () => "The Sims documentation does not exist.",
    },
    844: {
      fr: () => "L’objet documenté référencée n’existe pas.",
      en: () => "The referenced documented object does not exist.",
    },
    901: {
      fr: () =>
        "Vous ne disposez pas des autorisation requises pour la création d’une collection. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for creating a collection. For more information, please contact the management team.",
    },
    902: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la modification d’une collection. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for editing a collection. For more information, please contact the management team.",
    },
    903: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour la publication d’une collection. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for publishing a collection. For more information, please contact the management team.",
    },
    904: {
      fr: () =>
        "Vous ne disposez pas des autorisations requises pour l’envoi d’une collection. Pour plus d’informations, merci de vous rapprocher de l’équipe d’administration.",
      en: () =>
        "You do not have the required permissions for mailing a collection. For more information, please contact the management team.",
    },
    1002: {
      fr: "Un composant avec la même liste de codes et le même concept existe déjà.",
      en: "A component with the same code list and concept already exists.",
    },
    1004: {
      fr: () => "Le propriétaire n'est pas défini.",
      en: () => "The creator is not defined.",
    },
    1005: {
      fr: () => "Le statut de diffusion n'est pas défini.",
      en: () => "the Diffusion status is not defined.",
    },
    1006: {
      fr: () => "Le concept doit être publié.",
      en: () => "The concept must be published.",
    },
    1007: {
      fr: () => "La liste de codes doit être publiée.",
      en: () => "The codes list must be published.",
    },
    1008: {
      fr: () => "Tous les composants doivent être publiés",
      en: () => "All components must be validated.",
    },
    1101: {
      fr: () => "La liste de codes existe déjà.",
      en: () => "The codelist already exists.",
    },
    1102: {
      fr: () => "Une liste de codes ne peut pas être créée sans code.",
      en: () => "A codeList should contain at least one Code.",
    },
    1103: {
      fr: () => "La liste de codes n'a pas pu être supprimée : elle a déjà été publiée.",
      en: () => "The codeList could not be removed: it is already published.",
    },
    1104: {
      fr: () =>
        "La liste de codes n'a pas pu être supprimée : une autre liste de codes dépend d'elle.",
      en: () => "The codeList could not be removed: another codeList depends on it.",
    },
  },
};

export default messages;
