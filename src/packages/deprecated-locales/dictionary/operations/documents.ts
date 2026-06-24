const messages = {
  missingDocumentWhenExportingSims: {
    fr: (documentNames: string[]) =>
      "L’exportation du rapport avec tous les documents inclus est incomplète. Il vous manque les documents suivants : <ul><li>" +
      documentNames?.join("</li><li>") +
      "</ul>",
    en: (documentNames: string[]) =>
      "The export of this report with all included documents is incomplete. There is the following missing documents : <ul><li>" +
      documentNames?.join("</li><li>") +
      "</ul>",
  },
  missingDocumentWhenPublishingSims: {
    fr: (documentNames: string[]) =>
      "La publication du rapport est impossible : les documents suivants sont absents du stockage : <ul><li>" +
      documentNames?.join("</li><li>") +
      "</ul>",
    en: (documentNames: string[]) =>
      "This report cannot be published: the following documents are missing from storage: <ul><li>" +
      documentNames?.join("</li><li>") +
      "</ul>",
  },
  document: { fr: "Document", en: "Document" },
  link: { fr: "Lien", en: "Link" },
  titleDocument: { fr: "Document", en: "Document" },
  titleLink: { fr: "Lien", en: "Link" },
  titleUpdatedDate: { fr: "Date de mise à jour", en: "Updated date" },
  file: { fr: "Fichier", en: "File" },
  addDocument: {
    fr: "Ajouter un document",
    en: "Add a document",
  },
  addLink: {
    fr: "Ajouter un lien",
    en: "Add a link",
  },
  drag: {
    fr: "Glisser un fichier ici, ou cliquez ici pour en sélectionner",
    en: "Drag n drop some files here, or click to select files",
  },
  reorderDocument: {
    fr: "Déplacer pour réordonner",
    en: "Drag to reorder",
  },
  documentsSearchTitle: {
    fr: "Document/Lien - Recherche",
    en: "Document/Link - Search",
  },
  documentsTitle: {
    fr: "Document/Lien",
    en: "Document/Link",
  },
};

export default messages;
