/**
 * Code de la liste globale tel que manipulé par l'écran des listes partielles :
 * le modèle `Code` ne déclare pas `parent`, alors que la hiérarchie s'appuie
 * dessus ici.
 */
interface HierarchicalCode {
  code: string;
  labelLg1: string;
  parent?: string;
}

/** Code de la liste globale, marqué selon son appartenance à la liste partielle. */
type GlobalCode = HierarchicalCode & { id: string; label: string; isPartial: boolean };

export const partialInGlobalCodes = (
  parentCL: HierarchicalCode[],
  childCl: HierarchicalCode[],
): GlobalCode[] => {
  return parentCL
    .sort((a, b) => (a.code > b.code ? 1 : -1))
    .reduce<GlobalCode[]>((acc, c) => {
      return [
        ...acc,
        {
          ...c,
          id: c.code,
          label: c.labelLg1,
          isPartial: childCl.some(
            (partial) => partial.code === c.code && partial.parent === c.parent,
          ),
        },
      ];
    }, []);
};
