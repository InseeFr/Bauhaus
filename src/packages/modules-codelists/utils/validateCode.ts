import i18next from "i18next";
import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

const ZodCode = (shouldCheckDuplicate, codes) =>
  z.object({
    code: mandatoryAndNotEmptyTextField(i18next.t("codes.identifier")).refine(
      (value) => !shouldCheckDuplicate || !codes.some((c) => c.code === value),
      { error: i18next.t("codes.duplicateError") },
    ),
    labelLg1: mandatoryAndNotEmptyTextField(i18next.t("codes.label", { lng: "fr" })),
    labelLg2: mandatoryAndNotEmptyTextField(i18next.t("codes.label", { lng: "en" })),
  });

export const validateCode = (code, codes, updateMode) => {
  return formatValidation(ZodCode(!updateMode, codes))(code);
};
