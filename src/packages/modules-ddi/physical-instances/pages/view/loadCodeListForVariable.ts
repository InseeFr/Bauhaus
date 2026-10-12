import type { QueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { CodeListItem } from "../../../hooks/usePhysicalCodeLists";
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
  options: { skipMutualized?: boolean } = {},
): Promise<CodeListAndCategories> {
  const ref = codeRepresentation.CodeListReference;
  const agency = ref?.Agency;
  const id = ref?.ID;
  if (!agency || !id) return {};

  // À l'ouverture d'une variable, une liste mutualisée (lecture seule) n'est pas chargée ici : sans
  // codeList, l'éditeur la traite comme une liste réutilisée — comme pour une nouvelle variable — et
  // n'en lit que la vue allégée. Son DDI4 complet pèse ~15 fois plus (31 Mo pour 45 000 codes).
  // Sans le catalogue des listes mutualisées, on retombe sur le chargement complet plutôt que de
  // bloquer l'ouverture de la variable.
  if (options.skipMutualized && (await isMutualized(queryClient, agency, id))) return {};

  const data: PhysicalInstanceResponse = await queryClient.fetchQuery({
    queryKey: ["codeListById", agency, id],
    queryFn: () => DDIApi.getMutualizedCodeList(agency, id),
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

async function isMutualized(queryClient: QueryClient, agency: string, id: string) {
  try {
    const mutualized: CodeListItem[] = await queryClient.fetchQuery({
      queryKey: ["mutualizedCodeLists"],
      queryFn: () => DDIApi.getMutualizedCodeLists(),
    });
    return mutualized.some((cl) => cl.agencyId === agency && cl.id === id);
  } catch {
    return false;
  }
}
