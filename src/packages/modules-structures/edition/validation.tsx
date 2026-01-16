import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import D, { D1, D2 } from "../../deprecated-locales";

export const ZodStructure = z.object({
  identifiant: mandatoryAndNotEmptyTextField(D.idTitle),
  labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
  labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
});

export const validate = formatValidation(ZodStructure);
