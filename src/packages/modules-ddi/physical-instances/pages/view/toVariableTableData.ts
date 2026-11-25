import { pickFirstLang } from "../../../utils/multilingual";
import type { Variable, VariableTableData } from "../../types/api";

/** Ligne du tableau des variables pour un item Variable DDI 4. */
export function toVariableTableData(
  variable: Variable,
  langs: readonly string[],
): VariableTableData {
  return {
    id: variable.ID,
    name: pickFirstLang(variable.VariableName, langs) ?? "",
    label: pickFirstLang(variable.Label, langs) ?? "",
    type: getVariableType(variable),
    lastModified: variable.VersionDate?.DateTime || "",
  };
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
