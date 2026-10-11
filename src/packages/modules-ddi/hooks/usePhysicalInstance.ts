import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import { toVariableTableData } from "../physical-instances/pages/view/toVariableTableData";
import type {
  PhysicalInstanceResponse,
  VariableTableData,
  Variable,
} from "../physical-instances/types/api";
import { itemsOfType, singleItemOfType } from "../physical-instances/types/ddi4Items";
import { pickLang } from "../utils/multilingual";

const DEFAULT_LANG = "fr-FR";

function transformVariablesToTableData(
  data: PhysicalInstanceResponse,
  lang: string,
): VariableTableData[] {
  return itemsOfType(data, "Variable").map((variable: Variable) =>
    toVariableTableData(variable, lang),
  );
}

export function usePhysicalInstancesData(agencyId: string, id: string) {
  const query = useQuery({
    queryKey: ["physicalInstanceById", agencyId, id],
    queryFn: () => DDIApi.getPhysicalInstance(agencyId, id),
  });

  const variables: VariableTableData[] = query.data
    ? transformVariablesToTableData(query.data, DEFAULT_LANG)
    : [];

  const title = query.data
    ? (pickLang(singleItemOfType(query.data, "PhysicalInstance")?.Citation?.Title, DEFAULT_LANG) ??
      "")
    : "";
  const dataRelationshipName = query.data
    ? (pickLang(singleItemOfType(query.data, "DataRelationship")?.Label, DEFAULT_LANG) ?? "")
    : "";

  return {
    ...query,
    variables,
    title,
    dataRelationshipName,
  };
}
