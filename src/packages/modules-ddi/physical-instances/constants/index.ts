export const FILTER_ALL_TYPES = "all" as const;

/**
 * Durée d'affichage des toasts de succès. Un toast d'erreur n'en a pas : il est `sticky` et reste
 * affiché jusqu'à ce que l'utilisateur le ferme.
 */
export const TOAST_DURATION = 3000 as const;

export const VARIABLE_TYPES = {
  TEXT: "text",
  CODE: "code",
  DATE: "date",
  NUMERIC: "numeric",
} as const;

export function buildDataRelationshipLabel(physicalInstanceLabel: string): string {
  return "Structure : " + physicalInstanceLabel;
}

export function buildLogicalRecordLabel(physicalInstanceLabel: string): string {
  return "Enregistrement logique : " + physicalInstanceLabel;
}

/** Vocabulaires contrôlés de la DDI Alliance dont sont tirés NumericTypeCode et DateTypeCode. */
export const NUMERIC_TYPE_VOCABULARY_URI =
  "http://rdf-vocabulary.ddialliance.org/cv/NumericType/1.1.0/" as const;
export const DATE_TYPE_VOCABULARY_URI =
  "http://rdf-vocabulary.ddialliance.org/cv/DateType/1.1.2/" as const;
