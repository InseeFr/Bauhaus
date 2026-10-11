import type { ManagedMissingValuesRepresentation } from "../../types/api";

export type VariableValidationError = "nameRequired" | "labelRequired" | "sentinelLabelRequired";

/**
 * Règles bloquantes d'une variable, vérifiées sur toutes les variables modifiées au
 * « Sauvegarder » global (#1608) et signalées en direct par l'onglet Informations du formulaire.
 */
export function getVariableValidationErrors({
  name,
  label,
  sentinelMmvr,
}: {
  name: string;
  label: string;
  sentinelMmvr?: ManagedMissingValuesRepresentation;
}): VariableValidationError[] {
  const errors: VariableValidationError[] = [];
  if (!name.trim()) errors.push("nameRequired");
  if (!label.trim()) errors.push("labelRequired");
  // Valeurs sentinelles (#1566) : le back rejette en 400 une MMVR sans libellé.
  if (sentinelMmvr && !sentinelMmvr.Label?.some((entry) => entry["@value"]?.trim())) {
    errors.push("sentinelLabelRequired");
  }
  return errors;
}
