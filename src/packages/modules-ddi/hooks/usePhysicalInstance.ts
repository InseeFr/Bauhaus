import { useQuery } from "@tanstack/react-query";
import type {
  PhysicalInstanceResponse,
  VariableTableData,
  Variable,
} from "../physical-instances/types/api";

import { DDIApi } from "../../sdk";

function transformVariablesToTableData(
  data: PhysicalInstanceResponse,
): VariableTableData[] {
  if (!data.Variable) {
    return [];
  }

  return data.Variable.map((variable: Variable) => ({
    id: variable.ID,
    name: variable.VariableName?.String?.["#text"] || "",
    label: variable.Label?.Content?.["#text"] || "",
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

export function usePhysicalInstancesData(agencyId: string, id: string) {
  const query = useQuery({
    queryKey: ["physicalInstanceById", agencyId, id],
    queryFn: () => DDIApi.getPhysicalInstance(agencyId, id),
  });

  const variables: VariableTableData[] = query.data
    ? transformVariablesToTableData(query.data)
    : [];

  const title = query.data?.PhysicalInstance?.[0]?.Citation?.Title?.String?.["#text"] || "";
  const dataRelationshipName =
    query.data?.DataRelationship?.[0]?.DataRelationshipName?.String?.["#text"] || "";

  return {
    ...query,
    variables,
    title,
    dataRelationshipName,
  };
}
