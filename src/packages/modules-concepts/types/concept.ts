import type { ValidationState } from "@components/status";

export type ConceptForAdvancedSearch = {
  id: string;
  label: string;
  created: string;
  modified: string;
  disseminationStatus: string;
  validationState: ValidationState;
  definition: string;
  creator: string;
  isTopConceptOf: string;
  valid: string | null;
  altLabel: string | null;
};
