import i18next from "i18next";
import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

const ZodClassification = z.object({
  prefLabelLg1: mandatoryAndNotEmptyTextField(i18next.t("classification.title", { lng: "fr" })),
  prefLabelLg2: mandatoryAndNotEmptyTextField(i18next.t("classification.title", { lng: "en" })),
  additionalMaterial: z.url().optional(),
  legalMaterial: z.url().optional(),
  homepage: z.url().optional(),
});

export const validate = formatValidation(ZodClassification);
