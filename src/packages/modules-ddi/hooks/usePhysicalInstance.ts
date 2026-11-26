import { queryOptions, useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/ddi-api";

import { toVariableTableData } from "../physical-instances/pages/view/toVariableTableData";
import type {
  PhysicalInstanceResponse,
  VariableTableData,
  Variable,
} from "../physical-instances/types/api";
import { itemsOfType, singleItemOfType } from "../physical-instances/types/ddi4Items";
import { pickLang } from "../utils/multilingual";
import { useDefaultLocale } from "./useDefaultLocale";

function transformVariablesToTableData(
  data: PhysicalInstanceResponse,
  lang: string,
): VariableTableData[] {
  return itemsOfType(data, "Variable").map((variable: Variable) =>
    toVariableTableData(variable, lang),
  );
}

/** Lecture d'une PhysicalInstance, partagée par le hook et les préchargements (même cache). */
export const physicalInstanceQuery = (agencyId: string, id: string) =>
  queryOptions({
    queryKey: ["physicalInstanceById", agencyId, id],
    // Lecture lourde de Colectica : en cache jusqu'à son éviction après une sauvegarde.
    staleTime: Infinity,
    queryFn: () => DDIApi.getPhysicalInstance(agencyId, id),
  });

export function usePhysicalInstancesData(agencyId: string, id: string) {
  const query = useQuery(physicalInstanceQuery(agencyId, id));
  const lang = useDefaultLocale();

  const variables: VariableTableData[] = query.data
    ? transformVariablesToTableData(query.data, lang)
    : [];

  const title = query.data
    ? (pickLang(singleItemOfType(query.data, "PhysicalInstance")?.Citation?.Title, lang) ?? "")
    : "";
  const dataRelationshipName = query.data
    ? (pickLang(singleItemOfType(query.data, "DataRelationship")?.Label, lang) ?? "")
    : "";

  return {
    ...query,
    variables,
    title,
    dataRelationshipName,
  };
}
