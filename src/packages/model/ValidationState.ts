import D from "../i18n";

export const UNPUBLISHED = "Unpublished";
export const MODIFIED = "Modified";
export const VALIDATED = "Validated";

export const validateStateOptions = [
  { value: UNPUBLISHED, label: D.validationState.unpublished.m },
  { value: MODIFIED, label: D.validationState.modified.m },
  { value: VALIDATED, label: D.validationState.validated.m },
];
