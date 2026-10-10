/**
 * Doublure de `hooks/useClassificationItem` partagée par les pages d'un poste : importer ce module
 * remplace le hook par `useClassificationItem`, à configurer avec `mockReturnValue`.
 *
 * Le mock est enregistré à l'import de ce module : il doit donc être importé avant la page testée
 * (ce que garantit l'ordre des imports, `../item.testing` précédant `./page`).
 */
export const useClassificationItem = vi.fn();

vi.mock("../../hooks/useClassificationItem", () => import("./item.testing"));

export const itemParams = { classificationId: "nafr2", itemId: "01" };

/** Valeur du hook tant que le poste n'est pas encore chargé. */
export const loadingItem = { isLoading: true, item: undefined };
