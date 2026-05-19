import { useQuery } from "@tanstack/react-query";
import type {
  PhysicalInstanceResponse,
  VariableTableData,
  Variable,
} from "../physical-instances/types/api";
import { pickLang } from "../utils/multilingual";

import { DDIApi } from "../../sdk";

function transformVariablesToTableData(
  data: PhysicalInstanceResponse,
  lang: string,
): VariableTableData[] {
  if (!data.Variable) {
    return [];
  }

  return data.Variable.map((variable: Variable) => ({
    id: variable.ID,
    name: pickLang(variable.VariableName?.String, lang) ?? "",
    label: pickLang(variable.Label?.Content, lang) ?? "",
    type: getVariableType(variable),
    lastModified: variable["@versionDate"] || "",
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
    ? (pickLang(query.data.PhysicalInstance?.[0]?.Citation?.Title?.String, DEFAULT_LANG) ?? "")
    : "";
  const dataRelationshipName = query.data
    ? (pickLang(query.data.DataRelationship?.[0]?.Label?.Content, DEFAULT_LANG) ?? "")
    : "";

  return {
    ...query,
    variables,
    title,
    dataRelationshipName,
  };
}
