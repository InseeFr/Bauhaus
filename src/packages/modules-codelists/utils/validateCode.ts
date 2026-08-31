import codelistsI18n from "../i18n";
import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

/** Valeurs saisies dans le formulaire d'un code, avant validation. */
export interface CodeFormValues {
  code?: string;
  labelLg1?: string;
  labelLg2?: string;
}

const ZodCode = (shouldCheckDuplicate: boolean, codes: CodeFormValues[]) =>
  z.object({
    code: mandatoryAndNotEmptyTextField(codelistsI18n.t("codes.title")).refine(
      (value) => !shouldCheckDuplicate || !codes.some((c) => c.code === value),
      { error: codelistsI18n.t("codes.duplicateError") },
    ),
    labelLg1: mandatoryAndNotEmptyTextField(codelistsI18n.t("codes.label", { lng: "fr" })),
    labelLg2: mandatoryAndNotEmptyTextField(codelistsI18n.t("codes.label", { lng: "en" })),
  });

export const validateCode = (
  code: CodeFormValues,
  codes: CodeFormValues[],
  updateMode: boolean,
) => {
  return formatValidation(ZodCode(!updateMode, codes))(code);
};
