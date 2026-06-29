import type { Category, CodeList } from "../../types/api";
import type { VariableData } from "./viewReducer";

export interface LocalCodeListOverride {
  codeList: CodeList;
  categories?: Category[];
}

/**
 * Cherche, parmi les variables modifiées localement (non encore enregistrées), une liste de codes
 * partageant l'`id` donné. Sert à refléter immédiatement une surcharge : quand l'utilisateur a édité
 * une liste partagée depuis une variable puis ouvre une autre variable qui référence la même liste,
 * on lui montre la version localement surchargée plutôt que la version (périmée) du back-office.
 *
 * Retourne `undefined` si aucun `id` n'est fourni ou si aucune variable locale ne porte cette liste.
 */
export const findLocalCodeListOverride = (
  localVariables: VariableData[],
  codeListId: string | undefined,
): LocalCodeListOverride | undefined => {
  if (!codeListId) return undefined;
  const source = localVariables.find((variable) => variable.codeList?.ID === codeListId);
  if (!source?.codeList) return undefined;
  return { codeList: source.codeList, categories: source.categories };
};
