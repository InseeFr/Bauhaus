import type { QueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type {
  Category,
  Code,
  CodeList,
  CodeRepresentation,
  PhysicalInstanceResponse,
} from "../../types/api";
import { itemsOfType } from "../../types/ddi4Items";

export interface CodeListAndCategories {
  codeList?: CodeList;
  categories?: Category[];
  /**
   * `true` quand la variable référence une liste de codes (Agency + ID présents) qui
   * n'existe pas / n'a pas pu être résolue. Permet à l'appelant d'afficher une erreur
   * explicite plutôt que de présenter silencieusement une liste vide.
   */
  missing?: boolean;
}

export async function loadCodeListForVariable(
  queryClient: QueryClient,
  codeRepresentation: CodeRepresentation,
): Promise<CodeListAndCategories> {
  const ref = codeRepresentation.CodeListReference;
  const agency = ref?.Agency;
  const id = ref?.ID;
  if (!agency || !id) return {};

  const data: PhysicalInstanceResponse = await queryClient.fetchQuery({
    queryKey: ["codeListById", agency, id],
    queryFn: () => DDIApi.getMutualizedCodesList(agency, id),
  });

  const codeList = itemsOfType(data, "CodeList").find((cl) => cl.ID === id);
  if (!codeList) {
    // La référence pointe vers une liste de codes (agency + id) introuvable.
    return { missing: true };
  }
  if (!codeList.Code) {
    return { codeList };
  }

  const categoryIds = new Set(
    codeList.Code.map((c: Code) => c.CategoryReference?.ID).filter((catId): catId is string =>
      Boolean(catId),
    ),
  );
  const categories = itemsOfType(data, "Category").filter((cat: Category) =>
    categoryIds.has(cat.ID!),
  );
  return { codeList, categories };
}
