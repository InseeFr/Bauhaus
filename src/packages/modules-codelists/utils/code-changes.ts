import { CodelistsApi } from "@sdk/index";

/** Valeurs d'un code telles que saisies dans le panneau d'édition. */
export interface EditableCode {
  code?: string;
  labelLg1?: string;
  labelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
  /** Codes parents et enfants, par leur notation. */
  broader?: string[];
  narrower?: string[];
}

type CodeChangeType = "created" | "updated" | "deleted";

/**
 * Modifications de codes pas encore envoyées au serveur, indexées par code : elles ne partent
 * qu'à la sauvegarde de la liste.
 */
export type CodeChanges = Record<string, { type: CodeChangeType; code: EditableCode }>;

const toggle = (codes: string[] = [], code: string, present: boolean) => {
  const others = codes.filter((c) => c !== code);
  return present ? [...others, code] : others;
};

/**
 * Aligne les liens de `other` sur ceux que `code` vient de choisir : un lien se lit des deux côtés,
 * et c'est la dernière saisie qui fait foi. Un code supprimé disparaît des liens de `other`.
 */
const withInverseLinks = <T extends EditableCode>(
  other: T,
  code: EditableCode,
  deleted: boolean,
): T => {
  const isParent = !deleted && (code.broader ?? []).includes(other.code!);
  const isChild = !deleted && (code.narrower ?? []).includes(other.code!);
  const wasLinked = [...(other.broader ?? []), ...(other.narrower ?? [])].includes(code.code!);
  if (!isParent && !isChild && !wasLinked) {
    return other;
  }
  const narrower = toggle(other.narrower, code.code!, isParent);
  const broader = toggle(other.broader, code.code!, isChild);
  return { ...other, broader, narrower };
};

const withChange = (
  changes: CodeChanges,
  code: EditableCode,
  type: CodeChangeType,
): CodeChanges => {
  const others = Object.entries(changes)
    .filter(([key, change]) => key !== code.code && change.type !== "deleted")
    .map(([key, change]) => [
      key,
      { ...change, code: withInverseLinks(change.code, code, type === "deleted") },
    ]);
  return { ...changes, ...Object.fromEntries(others), [code.code!]: { type, code } };
};

const without = (changes: CodeChanges, code: EditableCode): CodeChanges => {
  const { [code.code!]: _removed, ...others } = withChange(changes, code, "deleted");
  return others;
};

export const withCreatedCode = (changes: CodeChanges, code: EditableCode): CodeChanges =>
  // Recréer un code supprimé mais encore présent en base revient à le modifier.
  withChange(changes, code, changes[code.code!]?.type === "deleted" ? "updated" : "created");

export const withUpdatedCode = (changes: CodeChanges, code: EditableCode): CodeChanges =>
  withChange(changes, code, changes[code.code!]?.type === "created" ? "created" : "updated");

export const withDeletedCode = (changes: CodeChanges, code: EditableCode): CodeChanges =>
  changes[code.code!]?.type === "created"
    ? without(changes, code)
    : withChange(changes, code, "deleted");

/** Applique les modifications en attente à une page de codes lue sur le serveur. */
export const mergeCodeChanges = <T extends EditableCode>(items: T[], changes: CodeChanges): T[] => {
  const itemCodes = new Set(items.map(({ code }) => code));
  const created = Object.values(changes)
    .filter(({ type, code }) => type === "created" && !itemCodes.has(code.code))
    .map(({ code }) => code as T);
  const merged = items
    .filter(({ code }) => changes[code!]?.type !== "deleted")
    .map((item) =>
      changes[item.code!]
        ? { ...item, ...changes[item.code!].code }
        : Object.values(changes).reduce(
            (linkedItem, { type, code }) => withInverseLinks(linkedItem, code, type === "deleted"),
            item,
          ),
    );
  return [...created, ...merged];
};

const SAVE_ORDER: CodeChangeType[] = ["deleted", "created", "updated"];

const SAVE_REQUESTS = {
  deleted: CodelistsApi.deleteCodesDetailedCodelist,
  updated: CodelistsApi.putCodesDetailedCodelist,
  created: CodelistsApi.postCodesDetailedCodelist,
};

/**
 * Envoie les modifications une à une, suppressions d'abord pour qu'un code recréé ne heurte pas
 * l'ancien, créations ensuite pour que les liens des codes modifiés visent des codes existants.
 * S'arrête à la première erreur ; `onSaved` signale chaque code déjà enregistré.
 */
export const saveCodeChanges = async (
  codelistId: string,
  changes: CodeChanges,
  onSaved: (code: string) => void,
) => {
  const ordered = SAVE_ORDER.flatMap((type) =>
    Object.values(changes).filter((change) => change.type === type),
  );
  const notCreatedYet = new Set(
    ordered.filter(({ type }) => type === "created").map(({ code }) => code.code),
  );
  for (const { type, code } of ordered) {
    notCreatedYet.delete(code.code);
    // Un lien vers un code créé plus loin sera posé par ce code-là : le back écrit les deux sens.
    const exists = (linked: string) => !notCreatedYet.has(linked);
    const body =
      type === "created"
        ? {
            ...code,
            broader: code.broader?.filter(exists),
            narrower: code.narrower?.filter(exists),
          }
        : code;
    await SAVE_REQUESTS[type](codelistId, body);
    onSaved(code.code!);
  }
};
