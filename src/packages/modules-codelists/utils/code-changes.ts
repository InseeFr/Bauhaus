import { CodelistsApi } from "@sdk/index";

/** Valeurs d'un code telles que saisies dans le panneau d'édition. */
export interface EditableCode {
  code?: string;
  labelLg1?: string;
  labelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
}

type CodeChangeType = "created" | "updated" | "deleted";

/**
 * Modifications de codes pas encore envoyées au serveur, indexées par code : elles ne partent
 * qu'à la sauvegarde de la liste.
 */
export type CodeChanges = Record<string, { type: CodeChangeType; code: EditableCode }>;

const withChange = (
  changes: CodeChanges,
  code: EditableCode,
  type: CodeChangeType,
): CodeChanges => ({ ...changes, [code.code!]: { type, code } });

const without = (changes: CodeChanges, code: EditableCode): CodeChanges =>
  Object.fromEntries(Object.entries(changes).filter(([key]) => key !== code.code));

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
    .map((item) => (changes[item.code!] ? { ...item, ...changes[item.code!].code } : item));
  return [...created, ...merged];
};

const SAVE_ORDER: CodeChangeType[] = ["deleted", "updated", "created"];

const SAVE_REQUESTS = {
  deleted: CodelistsApi.deleteCodesDetailedCodelist,
  updated: CodelistsApi.putCodesDetailedCodelist,
  created: CodelistsApi.postCodesDetailedCodelist,
};

/**
 * Envoie les modifications une à une, suppressions d'abord pour qu'un code recréé ne heurte pas
 * l'ancien. S'arrête à la première erreur ; `onSaved` signale chaque code déjà enregistré.
 */
export const saveCodeChanges = async (
  codelistId: string,
  changes: CodeChanges,
  onSaved: (code: string) => void,
) => {
  const ordered = SAVE_ORDER.flatMap((type) =>
    Object.values(changes).filter((change) => change.type === type),
  );
  for (const { type, code } of ordered) {
    await SAVE_REQUESTS[type](codelistId, code);
    onSaved(code.code!);
  }
};
