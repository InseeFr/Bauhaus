import { createDictionary, firstLang, getLang, secondLang } from "@utils/dictionnary";
import { Dictionary } from "@utils/types";

const dictionary = {
  btnNew: {
    masculine: {
      fr: "Nouveau",
      en: "New",
    },
    feminine: {
      fr: "Nouvelle",
      en: "New",
    },
  },
  disseminationStatus: {
    DSPublicGeneriqueTitle: {
      fr: "Public générique",
      en: "Public generic",
    },
    DSPublicSpecifiqueTitle: {
      fr: "Public spécifique",
      en: "Public specific",
    },
    DSPrivateTitle: {
      fr: "Privé",
      en: "Private",
    },
    title: {
      fr: "Statut de diffusion",
      en: "Dissemination status",
    },
    placeholder: {
      fr: "Sélectionnez un statut de diffusion...",
      en: "Select dissemination status...",
    },
  },
  loading: {
    auth: {
      fr: "Authentification en cours...",
      en: "Authentication in progress...",
    },
    saving: {
      fr: "Sauvegarde en cours...",
      en: "Saving in progress...",
    },
    sending: {
      fr: "Envoi en cours...",
      en: "Sending in progress...",
    },
    exporting: {
      fr: "Export en cours...",
      en: "Export in progress...",
    },
    validating: {
      fr: "Publication en cours ...",
      en: "Publish in progress ...",
    },
    loading: {
      fr: "Chargement en cours...",
      en: "Loading in progress...",
    },
    deleting: {
      fr: "Suppression en cours...",
      en: "Deleting in progress...",
    },
  },
  creatorsInput: {
    creatorsTitle: {
      fr: "Propriétaires",
      en: "Owners",
    },
    creatorTitle: {
      fr: "Propriétaire",
      en: "Owner",
    },
  },
  contributors: {
    title: {
      fr: "Gestionnaires",
      en: "Contributors",
    },
    stampsPlaceholder: {
      fr: "Sélectionnez un timbre...",
      en: "Select stamp...",
    },
  },
  version: {
    fr: "Version",
    en: "Version",
  },
  conceptsScopeNote: {
    fr: "Définition courte",
    en: "Short definition",
  },
  conceptsDefinition: {
    fr: "Définition",
    en: "Definition",
  },
  conceptsEditorialNote: {
    fr: "Note éditoriale",
    en: "Editorial note",
  },
  conceptsChangeNote: {
    fr: "Note de changement",
    en: "Change note",
  },
  classificationsDefinition: {
    fr: "Note générale",
    en: "General note",
  },
  classificationsScopeNote: {
    fr: "Remarque",
    en: "Remark",
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
};

export const D1: Dictionary = createDictionary(firstLang, dictionary);
export const D2: Dictionary = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
