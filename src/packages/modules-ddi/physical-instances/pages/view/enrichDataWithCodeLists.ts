import type { QueryClient } from "@tanstack/react-query";
import type { Category, CodeList, PhysicalInstanceResponse, Variable } from "../../types/api";
import { itemsOfType, replaceItemsOfType } from "../../types/ddi4Items";
import { loadCodeListForVariable } from "./loadCodeListForVariable";

/**
 * Le GET PhysicalInstance ne renvoie plus les CodeList/Category (chargées à la
 * demande par variable). Avant un export (DDI3 ou DDI4), on réinjecte donc dans
 * `data` toutes les listes de codes référencées par ses variables Code, afin que
 * l'export reste autoportant.
 *
 * Les listes de sentinelles (#1590) sont dans le même cas : elles sont référencées
 * par les `MissingCodeRepresentation` des ManagedMissingValuesRepresentation, pas par
 * la représentation d'une variable, et manquaient donc à l'export.
 */
export async function enrichDataWithCodeLists(
  queryClient: QueryClient,
  data: PhysicalInstanceResponse,
): Promise<PhysicalInstanceResponse> {
  const variables: Variable[] = itemsOfType(data, "Variable");
  const codeRepresentations = [
    ...variables
      .map((variable) => variable.VariableRepresentation?.CodeRepresentation)
      .filter((rep): rep is NonNullable<typeof rep> => Boolean(rep)),
    ...itemsOfType(data, "ManagedMissingValuesRepresentation").flatMap(
      (mmvr) => mmvr.MissingCodeRepresentation ?? [],
    ),
  ];

  if (codeRepresentations.length === 0) {
    return data;
  }

  const codeListMap = new Map<string, CodeList>(
    itemsOfType(data, "CodeList").map((cl) => [cl.ID, cl]),
  );
  const categoryMap = new Map<string, Category>(
    itemsOfType(data, "Category").map((cat) => [cat.ID!, cat]),
  );

  const loaded = await Promise.all(
    codeRepresentations.map((rep) => loadCodeListForVariable(queryClient, rep)),
  );

  for (const { codeList, categories } of loaded) {
    if (codeList) {
      codeListMap.set(codeList.ID, codeList);
    }
    categories?.forEach((category) => categoryMap.set(category.ID!, category));
  }

  const withCodeLists = replaceItemsOfType(data, "CodeList", Array.from(codeListMap.values()));
  return replaceItemsOfType(withCodeLists, "Category", Array.from(categoryMap.values()));
}
