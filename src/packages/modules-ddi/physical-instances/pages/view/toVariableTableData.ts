import { pickLang } from "../../../utils/multilingual";
import type { Variable, VariableTableData } from "../../types/api";

const DEFAULT_LANG = "fr-FR";

/** Ligne du tableau des variables pour un item Variable DDI 4. */
export function toVariableTableData(variable: Variable, lang = DEFAULT_LANG): VariableTableData {
  return {
    id: variable.ID,
    name: pickLang(variable.VariableName, lang) ?? "",
    label: pickLang(variable.Label, lang) ?? "",
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
