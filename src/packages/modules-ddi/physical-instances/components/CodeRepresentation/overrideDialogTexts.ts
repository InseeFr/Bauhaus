/**
 * Les trois déclinaisons de la confirmation d'édition d'éléments partagés : liste partagée
 * (cas 1), liste ET catégorie partagées (cas 2), catégorie partagée dans une liste propre à la
 * variable (cas 3). Le cas 4 (rien de partagé) n'ouvre pas de popup.
 */
export type OverrideDialogCase = "list" | "listAndCategory" | "category";

/** Racine des clés i18n de chaque cas. */
const KEY_BASE: Record<OverrideDialogCase, string> = {
  list: "physicalInstance.view.code.overrideShared",
  listAndCategory: "physicalInstance.view.code.overrideSharedCategory",
  category: "physicalInstance.view.code.overrideCategory",
};

/** Clés communes aux trois cas (bouton Annuler, marqueur « recommandé », résumé de noms). */
const COMMON = "physicalInstance.view.code.override";

/** Au-delà, la liste des noms impactés est tronquée par un « et N autres ». */
const MAX_LISTED_NAMES = 3;

export const overrideDialogKeyBase = (dialogCase: OverrideDialogCase) => KEY_BASE[dialogCase];

export interface OverrideDialogTextParams {
  /** Libellé de la liste de codes éditée. */
  codeListLabel: string;
  /** Variables AUTRES que celle éditée qui utilisent la liste : ce sont elles qui seraient impactées. */
  otherVariableNames: string[];
  /** Libellé de la catégorie éditée (cas 2 et 3). */
  categoryLabel?: string;
  /** Listes de codes AUTRES que celle éditée qui utilisent la catégorie. */
  otherCodeListNames: string[];
  /** Nom de la variable en cours d'édition, déjà replié sur un libellé générique si absent. */
  editedVariableName: string;
}

export interface OverrideDialogChoice {
  /** Intitulé de l'action, qui doit se suffire à lui-même hors de tout contexte. */
  label: string;
  /** Sa conséquence, en une phrase. */
  description: string;
}

export interface OverrideDialogTexts {
  title: string;
  /** Phrases du bandeau : qui d'autre utilise quoi. */
  contextSentences: string[];
  /**
   * Énumération des éléments impactés, quand ils sont assez nombreux pour ne pas tenir dans les
   * phrases de contexte. Vide sinon (le nom unique y est déjà cité).
   */
  impactedSummary: string | null;
  question: string;
  /** L'issue sans conséquence pour les autres : c'est le choix mis en avant. */
  variant: OverrideDialogChoice;
  /** L'issue qui modifie l'élément partagé pour tout le monde. */
  overwrite: OverrideDialogChoice;
  cancel: string;
}

type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * « Sexe, Âge, Poids » ou, au-delà de trois, « Sexe, Âge, Poids et 2 autres ». Ne sert que dès
 * deux éléments : à un seul, les phrases de contexte le nomment déjà.
 */
const summarizeNames = (names: string[], t: Translate): string | null => {
  if (names.length < 2) {
    return null;
  }
  if (names.length <= MAX_LISTED_NAMES) {
    return names.join(", ");
  }
  return t(`${COMMON}.andMore`, {
    names: names.slice(0, MAX_LISTED_NAMES).join(", "),
    count: names.length - MAX_LISTED_NAMES,
  });
};

/**
 * Textes de la popup pour un cas de partage donné. Une entrée par cas plutôt qu'une cascade de
 * ternaires : ajouter un cas revient à ajouter une ligne, et chaque cas se lit d'un bloc.
 *
 * Tous les comptes annoncés sont ceux des éléments AUTRES que celui en cours d'édition — ce sont
 * les seuls qu'une modification impacterait. Quand il n'y en a qu'un, il est nommé plutôt que
 * compté : « aussi utilisée par la variable Âge » vaut mieux que « utilisée par 1 variable ».
 */
export const overrideDialogTexts = (
  dialogCase: OverrideDialogCase,
  t: Translate,
  {
    codeListLabel,
    otherVariableNames,
    categoryLabel,
    otherCodeListNames,
    editedVariableName,
  }: OverrideDialogTextParams,
): OverrideDialogTexts => {
  const keyBase = KEY_BASE[dialogCase];
  const variableCount = otherVariableNames.length;
  const codeListCount = otherCodeListNames.length;
  const variableOptions = {
    label: codeListLabel,
    count: variableCount,
    firstOther: otherVariableNames[0],
  };
  const codeListOptions = {
    label: categoryLabel,
    count: codeListCount,
    firstOther: otherCodeListNames[0],
  };

  const listMessage = t(`${KEY_BASE.list}.message`, variableOptions);

  const byCase: Record<
    OverrideDialogCase,
    Pick<OverrideDialogTexts, "contextSentences" | "impactedSummary" | "variant" | "overwrite">
  > = {
    list: {
      contextSentences: [listMessage],
      impactedSummary: summarizeNames(otherVariableNames, t),
      variant: {
        label: t(`${keyBase}.variantLabel`),
        description: t(`${keyBase}.variantDescription`, { variable: editedVariableName }),
      },
      overwrite: {
        label: t(`${keyBase}.overwriteLabel`),
        description: t(`${keyBase}.overwriteDescription`, variableOptions),
      },
    },
    listAndCategory: {
      // La popup combinée s'affiche dès que la liste est partagée, même si la catégorie n'est
      // utilisée que par cette liste (une variante de la seule liste laisserait la catégorie
      // partagée entre l'originale et la variante). Dans ce cas la phrase sur la catégorie
      // n'aurait rien à annoncer : on l'omet plutôt que de parler de « 0 autres listes ».
      contextSentences: [
        listMessage,
        ...(codeListCount > 0 ? [t(`${keyBase}.categoryMessage`, codeListOptions)] : []),
      ],
      // Deux populations impactées (variables et listes) : les énumérer ensemble embrouillerait
      // plus qu'il n'aiderait. Le détail reste dans les deux panneaux d'utilisations.
      impactedSummary: null,
      variant: {
        label: t(`${keyBase}.variantLabel`),
        description: t(`${keyBase}.variantDescription`, { variable: editedVariableName }),
      },
      overwrite: {
        label: t(`${keyBase}.overwriteLabel`),
        description: t(`${keyBase}.overwriteDescription`),
      },
    },
    category: {
      contextSentences: [
        t(`${keyBase}.ownListMessage`, { variable: editedVariableName }),
        t(`${keyBase}.categoryMessage`, codeListOptions),
      ],
      impactedSummary: summarizeNames(otherCodeListNames, t),
      variant: {
        label: t(`${keyBase}.variantLabel`),
        description: t(`${keyBase}.variantDescription`),
      },
      overwrite: {
        label: t(`${keyBase}.overwriteLabel`),
        description: t(`${keyBase}.overwriteDescription`, codeListOptions),
      },
    },
  };

  return {
    title: t(`${keyBase}.title`),
    question: t(`${COMMON}.question`),
    cancel: t(`${COMMON}.cancel`),
    ...byCase[dialogCase],
  };
};
