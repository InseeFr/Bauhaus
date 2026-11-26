import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import { toVariableTableData } from "../physical-instances/pages/view/toVariableTableData";
import type {
  PhysicalInstanceResponse,
  VariableTableData,
  Variable,
} from "../physical-instances/types/api";
import { itemsOfType, singleItemOfType } from "../physical-instances/types/ddi4Items";
import { pickFirstLang } from "../utils/multilingual";
import { useColecticaLangs } from "./useColecticaLangs";

function transformVariablesToTableData(
  data: PhysicalInstanceResponse,
  langs: readonly string[],
): VariableTableData[] {
  return itemsOfType(data, "Variable").map((variable: Variable) =>
    toVariableTableData(variable, langs),
  );
}

export function usePhysicalInstancesData(agencyId: string, id: string) {
  const langs = useColecticaLangs();
  const query = useQuery({
    queryKey: ["physicalInstanceById", agencyId, id],
    // Lecture lourde de Colectica : en cache jusqu'à son éviction après une sauvegarde.
    staleTime: Infinity,
    queryFn: () => DDIApi.getPhysicalInstance(agencyId, id),
  });

  const variables: VariableTableData[] = query.data
    ? transformVariablesToTableData(query.data, langs)
    : [];

  const title = query.data
    ? (pickFirstLang(singleItemOfType(query.data, "PhysicalInstance")?.Citation?.Title, langs) ??
      "")
    : "";
  const dataRelationshipName = query.data
    ? (pickFirstLang(singleItemOfType(query.data, "DataRelationship")?.Label, langs) ?? "")
    : "";

  return {
    ...query,
    variables,
    title,
    dataRelationshipName,
  };
}
