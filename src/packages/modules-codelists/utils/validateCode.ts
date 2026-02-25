import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import D, { D1, D2 } from "../i18n/build-dictionary";

const ZodCode = (shouldCheckDuplicate, codes) =>
  z.object({
    code: mandatoryAndNotEmptyTextField(D.idTitle).refine(
      (value) => !shouldCheckDuplicate || !codes.some((c) => c.code === value),
      { error: D.ErrorDoubleCode },
    ),
    labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
    labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
  });

export const validateCode = (code, codes, updateMode) => {
  return formatValidation(ZodCode(!updateMode, codes))(code);
};
