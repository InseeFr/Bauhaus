import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type {
  PhysicalInstanceResponse,
  VariableTableData,
  Variable,
} from "../physical-instances/types/api";
import { itemsOfType, singleItemOfType } from "../physical-instances/types/ddi4Items";
import { pickLang } from "../utils/multilingual";

function transformVariablesToTableData(
  data: PhysicalInstanceResponse,
  lang: string,
): VariableTableData[] {
  return itemsOfType(data, "Variable").map((variable: Variable) => ({
    id: variable.ID,
    name: pickLang(variable.VariableName, lang) ?? "",
    label: pickLang(variable.Label, lang) ?? "",
    type: getVariableType(variable),
    lastModified: variable.VersionDate?.DateTime || "",
  }));
}

function getVariableType(variable: Variable): string {
  if (variable.VariableRepresentation?.CodeRepresentation) {
    return "code";
  }
  if (variable.VariableRepresentation?.NumericRepresentation) {
    return "numeric";
  }
  if (variable.VariableRepresentation?.DateTimeRepresentation) {
    return "date";
  }
  return "text";
}

const DEFAULT_LANG = "fr-FR";

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
