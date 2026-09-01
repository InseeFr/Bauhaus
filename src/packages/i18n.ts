import { createDictionary, Dictionary, firstLang, getLang, secondLang } from "@utils/dictionnary";

const dictionary = {
  authentication: {
    logout: {
      fr: "Se déconnecter",
      en: "Logout",
    },
    login: {
      fr: "Se connecter",
      en: "Login",
    },
  },
  validationState: {
    validated: {
      m: {
        fr: "Publié",
        en: "Published",
      },
      f: {
        fr: "Publiée",
        en: "Published",
      },
    },
    modified: {
      m: {
        fr: "Provisoire déjà publié",
        en: "Provisional, already published",
      },
      f: {
        fr: "Provisoire déjà publiée",
        en: "Provisional, already published",
      },
    },
    unpublished: {
      m: {
        fr: "Provisoire",
        en: "Provisional",
      },
      f: {
        fr: "Provisoire",
        en: "Provisional",
      },
    },
  },
  errors: {
    globalClientSideErrorBloc: {
      fr: "Vous avez des erreurs dans ce formulaire.",
      en: "You have errors in this form.",
    },
    serversideErrors: {
      500: {
        fr: (error: string) =>
          `Une erreur s'est produite. Veuillez contacter l'équipe d'administration RMéS en lui communiquant le message suivant: ${error}`,
        en: (error: string) =>
          `An error has occurred. Please contact the RMéS administration team and provide them with the following message: ${error}`,
      },
    },
    mandatoryProperty: {
      fr: (propertyName: string) =>
        `La propriété <strong>${propertyName}</strong> est obligatoire.`,
      en: (propertyName: string) => `The property <strong>${propertyName}</strong> is required.`,
    },
  },
};

export const D1: Dictionary = createDictionary(firstLang, dictionary);
export const D2: Dictionary = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
export const isLang2 = () => getLang() === secondLang;
