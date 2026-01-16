import { createAllDictionary } from "@utils/dictionnary";

export const { D, D1, D2, lg1, lg2 } = createAllDictionary({
  errors: {
    1203: {
      fr: () => "Seules les datasets non publiées peuvent être supprimées",
      en: () => "Only unpublished datasets can be deleted",
    },
    1204: {
      fr: () => "Seules les datasets sans distributions associées peuvent être supprimées",
      en: () => "Only dataset without any distribution can be deleted",
    },
    1205: {
      fr: () => "Seules les datasets sans distributions dérivées peuvent être supprimées",
      en: () => "Only dataset without any derived dataset can be deleted",
    },
  },
  datasets: {
    linkedDocuments: {
      fr: "Documents liés",
      en: "Linked documents",
    },
    keywords: {
      fr: "Mots clés",
      en: "Keywords",
    },
  },
});
