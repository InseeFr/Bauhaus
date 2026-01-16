const dictionary = {
  btnNewLink: {
    fr: "Nouveau lien",
    en: "New link",
  },
  conceptsTitle: {
    fr: "Concepts",
    en: "Concepts",
  },
  conceptSearchTitle: {
    fr: "Concepts - Recherche",
    en: "Concepts - Search",
  },

  conceptsNumberTitle: {
    fr: "Nombre de concepts",
    en: "Number of concepts",
  },
  collectionsNumberTitle: {
    fr: "Nombre de collections",
    en: "Number of collections",
  },
  topConceptsNumberTitle: {
    fr: "dont « top concepts »",
    en: "of which “top concepts”",
  },
  provisionalConceptsNumberTitle: {
    fr: "dont « provisoires »",
    en: "of which “provisional”",
  },
  validDateConceptsNumberTitle: {
    fr: "dont « ayant une date de fin de validité »",
    en: "of which “having an expiration date”",
  },
  collectionsTitle: {
    fr: "Collections",
    en: "Collections",
  },
  collectionSearchTitle: {
    fr: "Collections - Recherche",
    en: "Collections - Search",
  },
  conceptVersionTitle: {
    fr: "Version du concept",
    en: "Concept version",
  },
  sendConceptTitle: {
    fr: (label: string) => `Envoyer le concept " ${label} "`,
    en: (label: string) => `Send concept " ${label} "`,
  },
  sendCollectionTitle: {
    fr: (label: string) => `Envoyer la collection " ${label} "`,
    en: (label: string) => `Send collection " ${label} "`,
  },
  conceptsExportPanelTitle: {
    fr: "Concepts à exporter",
    en: "Concepts to export",
  },
  hasNotConceptToExport: {
    fr: "Ajouter au moins un concept à exporter",
    en: "Add at least one concept to export",
  },
  collectionsExportPanelTitle: {
    fr: "Collections à exporter",
    en: "Collections to export",
  },
  hasNotCollectionToExport: {
    fr: "Ajouter au moins une collection à exporter",
    en: "Add at least one collection to export",
  },
  conceptsToValidTitle: {
    fr: "Publication des concepts provisoires",
    en: "Publishing of the provisional concepts",
  },
  conceptsToValidPanelTitle: {
    fr: "Concepts à publier",
    en: "Concepts to publish",
  },
  hasNotConceptToValid: {
    fr: "Ajouter au moins un concept à publier",
    en: "Add at least one concept to publish",
  },
  conceptStandBy: {
    fr: "Le concept est en cours de la publication par",
    en: "The concept is being published by",
  },
  collectionsToValidTitle: {
    fr: "Publication des collections provisoires",
    en: "Publication of the provisional collections",
  },
  collectionsToValidPanelTitle: {
    fr: "Collections à publier",
    en: "Collections to publish",
  },
  hasNotCollectionToValid: {
    fr: "Ajouter au moins une collection à publier",
    en: "Add at least one collection to publish",
  },
  collectionStandBy: {
    fr: "La collection est en cours de la publication par",
    en: "The collection is being published by",
  },
  isConceptValidTitle: {
    fr: "État du concept",
    en: "Publication status",
  },
  isCollectionValidTitle: {
    fr: "État de la collection",
    en: "Publication status",
  },
  conceptsDefinition: {
    fr: "Définition",
    en: "Definition",
  },
  conceptsScopeNote: {
    fr: "Définition courte",
    en: "Short definition",
  },
  conceptsEditorialNote: {
    fr: "Note éditoriale",
    en: "Editorial note",
  },
  conceptsChangeNote: {
    fr: "Note de changement",
    en: "Change note",
  },
  incompleteConcept: {
    fr: "Remplissez les champs requis pour pouvoir sauvegarder ce concept",
    en: "Complete required fields in order to save this concept",
  },
  incompleteCollection: {
    fr: "Remplissez les champs requis pour pouvoir sauvegarder cette collection",
    en: "Complete required fields in order to save this collection",
  },
  emptyDefinitionLg1: {
    fr: "Le concept doit nécessairement comporter une définition",
    en: "The concept must have a definition",
  },
  emptyScopeNoteLg1: {
    fr: "Le statut de diffusion étant public, la définition courte française doit être renseignée",
    en: "As dissemination status is public, short definition has to be completed",
  },
  hasScopeNoteLg2NotLg1: {
    fr: "La définition courte ne peut être renseignée que dans la seconde langue",
    en: "The short definition can only be completed in the second language",
  },
  hasEditorialNoteLg2NotLg1: {
    fr: "La note éditoriale ne peut être renseignée que dans la seconde langue",
    en: "The editorial note can only be completed in the second language",
  },
  hasChangeNoteLg2NotLg1: {
    fr: "La note de changement ne peut être renseignée que dans la seconde langue",
    en: "The change note can only be completed in the second language",
  },
  tooLongScopeNote: {
    fr: (max: number) => `La définition courte est limitée à ${max} caractères`,
    en: (max: number) => `Short definition is limited to ${max} characters`,
  },
  scopeNoteChar: {
    fr: "caractères maximum",
    en: "characters maximum",
  },
  createConceptTitle: {
    fr: "Créer un nouveau concept",
    en: "Create concept",
  },
  updateConceptTitle: {
    fr: "Modifier le concept",
    en: "Update concept",
  },
  createCollectionTitle: {
    fr: "Créer une nouvelle collection",
    en: "Create collection",
  },
  updateCollectionTitle: {
    fr: "Modifier la collection",
    en: "Update collection",
  },
  conceptStatusValid: {
    fr: "Publié",
    en: "Published",
  },
  conceptStatusProvisional: {
    fr: "Provisoire",
    en: "Provisional",
  },
  collectionStatusValid: {
    fr: "Publiée",
    en: "Published",
  },
  collectionStatusProvisional: {
    fr: "Provisoire",
    en: "Provisional",
  },
  conceptsCreationDateMessage: {
    fr: "Concept créé entre le",
    en: "Concept created between",
  },
  conceptsUpdateDateMessage: {
    fr: "Concept modifié entre le",
    en: "Concept modified between",
  },
  conceptsTransitionDateMessage: {
    fr: "et le",
    en: "and",
  },
  conceptVersioningTitle: {
    fr: "Veuillez sélectionner le type de version",
    en: "Please select versioning type",
  },
  conceptVersioningBody: {
    fr: (label: string) =>
      `<p>Les notes du concept «<b>${label}</b>» ont été modifiées.</p><p>Voulez-vous créer une nouvelle version, ou écraser les données précédentes ?</p>`,
    en: (label: string) =>
      `<p>Concept “<b>${label}</b>” notes have been modified.</p><p>Would you like to create a new version, or update the previous one?</p>`,
  },
  conceptVersioningFooter: {
    fr: `<p>Pour créer une nouvelle version, la note de changement doit être documentée :</p>
          <ul><li><p>La note ne peut être vide</p></li>
          <li><p>La note doit être différente de celle de la version précédente</p></li></ul>`,
    en: `<p>To create new version, a change note has to be documented:</p>
          <ul><li><p>Note can't be empty</p></li>
          <li><p>Note has to be different from the previous one</p></li></ul>`,
  },
  conceptMailObjectDefault: {
    fr: (label: string) => `RMéS - Envoi du descriptif du concept «${label}»`,
    en: (label: string) => `RMéS - Sending the concept “${label}” description`,
  },
  conceptMailDefault: {
    fr: (params: any[]) => {
      let validText = "";
      const prefLabelLg1 = params[1],
        id = params[2],
        href = params[0] + "concept/" + id,
        inseeText = ` (<a href=${href}>Lien vers le concept</a>)`;
      if (params.includes("false"))
        validText = `<p><b>Ce concept est en attente de publication.</b></p>`;
      return `<p>Bonjour,</p>
          <p>Vous trouverez ci-joint la description du concept «<b>
          ${prefLabelLg1}
          </b>» ${inseeText} extraite de la base RMéS-Bauhaus Concepts.</p>
          ${validText}
          <p>Pour toute demande concernant ce concept, merci d’utiliser la boîte fonctionnelle <a href="mailto:dg75-administration-rmes@insee.fr">dg75-administration-rmes@insee.fr<a>.</p>
          <p>L'équipe RMéS<br/>
          DMCSI - Unité Qualité</p>`;
    },
    en: (params: any[]) => {
      let validText = "";
      const prefLabelLg1 = params[1],
        id = params[2],
        href = params[0] + "concept/" + id,
        inseeText = ` (<a href=${href}>Concept link</a>)`;
      if (params.includes("false"))
        validText = `<p><b>This concept is waiting for publication.</b></p>`;
      return `<p>Hi,</p>
          <p>You will find attached the description of the concept “<b>
          ${prefLabelLg1}
          </b>” ${inseeText} extracted from the RMéS-Concepts repository.</p>
          ${validText}
          <p>For any request concerning this concept please answer via the functional mail box <a href="mailto:dg75-administration-rmes@insee.fr">dg75-administration-rmes@insee.fr<a>.</p>
          <p>The RMéS team<br/>
          DMCSI - Quality Unit</p>`;
    },
  },
  sendConceptSuccess: {
    fr: (label: string) => `Le concept « ${label} » a bien été envoyé`,
    en: (label: string) => `Concept “${label}” has been sent`,
  },
  sendConceptFailure: {
    fr: (label: string) => `Le concept « ${label} » n'a pas été envoyé`,
    en: (label: string) => `Concept “${label}” was not sent`,
  },
  collectionMailObjectDefault: {
    fr: (label: string) => `RMéS - Envoi de la composition de la collection «${label}»`,
    en: (label: string) => `RMéS - Sending the composition of collection “${label}”`,
  },
  collectionMailDefault: {
    fr: (params: any[]) => {
      let validText = "";
      const prefLabelLg1 = params[1],
        id = params[2],
        href = params[0] + "collection/" + id,
        inseeText = ` (<a href=${href}>Lien vers la collection</a>)`;
      if (params.includes("false"))
        validText = `<p><b>Cette collection est en attente de publication.</b></p>`;
      return `<p>Bonjour,</p>
	          <p>Vous trouverez ci-joint la composition de la collection de concepts «<b>
	          ${prefLabelLg1}
	          </b>» ${inseeText} extraite de la base RMéS-Bauhaus Concepts.</p>
	          ${validText}
	          <p>Pour toute demande concernant cette collection, merci d’utiliser la boîte fonctionnelle <a href="mailto:dg75-administration-rmes@insee.fr">dg75-administration-rmes@insee.fr<a>.</p>
	          <p>L'équipe RMéS<br/>
	          DMCSI - Unité Qualité</p>`;
    },
    en: (params: any[]) => {
      let validText = "";

      const prefLabelLg1 = params[1],
        id = params[2],
        href = params[0] + "collection/" + id,
        inseeText = ` (<a href=${href}>Collection link</a>)`;
      if (params.includes("false"))
        validText = `<p><b>This collection is waiting for publication.</b></p>`;
      return `<p>Hi,</p>
	          <p>You will find attached the composition of the collection “<b>
	          ${prefLabelLg1}
	          </b>” ${inseeText} extracted from the RMéS-Concepts repository.</p>
	          ${validText}
	          <p>For any request concerning this collection please answer via the functional mail box :DG75 RMéS-Concepts et définitions.</p>
	          <p>The RMéS team<br/>
	          Insee - DG<br/>
	          DMCSI - Quality Unit</p>`;
    },
  },
  sendCollectionSuccess: {
    fr: (label: string) => `La collection « ${label} » a bien été envoyée`,
    en: (label: string) => `Collection “${label}” has been sent`,
  },
  sendCollectionFailure: {
    fr: (label: string) => `La collection « ${label} » n'a pas été envoyée`,
    en: (label: string) => `Collection “${label}” was not sent`,
  },
  dashboardConceptsTitle: {
    fr: "Tableau de bord des concepts",
    en: "Concepts dashboard",
  },
  dashboardConceptsSummaryTitle: {
    fr: "Etat de la base des concepts au",
    en: "State of the concepts repository at",
  },
  dashboardCollectionsSummaryTitle: {
    fr: "Etat de la base des collections au",
    en: "State of the collections repository at",
  },
  dashboardConceptsListPickerTitle: {
    fr: (type: string) => `Liste des ${type} de concepts depuis le:`,
    en: (type: string) => `Concepts ${type} list since:`,
  },
  dashboardCollectionsListPickerTitle: {
    fr: (type: string) => `Liste des ${type} de collections depuis le:`,
    en: (type: string) => `Collections ${type} list since:`,
  },
  dashboardConceptsByCreatorTitle: {
    fr: "Nombre de concepts par propriétaire",
    en: "Number of concepts by owner",
  },
  dashboardCollectionsByCreatorTitle: {
    fr: "Nombre de collections par propriétaire",
    en: "Number of collections by owner",
  },
};

export default dictionary;
