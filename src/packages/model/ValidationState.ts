import { appI18n } from "../i18n";

export const UNPUBLISHED = "Unpublished";
export const MODIFIED = "Modified";
export const VALIDATED = "Validated";

export const validateStateOptions = [
  { value: UNPUBLISHED, label: appI18n.t("validationState.unpublished.m") },
  { value: MODIFIED, label: appI18n.t("validationState.modified.m") },
  { value: VALIDATED, label: appI18n.t("validationState.validated.m") },
];
