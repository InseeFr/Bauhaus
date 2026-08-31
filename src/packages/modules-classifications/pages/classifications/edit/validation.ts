import { classificationsI18n } from "../../../i18n";
import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

const ZodClassification = z.object({
  prefLabelLg1: mandatoryAndNotEmptyTextField(
    classificationsI18n.t("classification.title", { lng: "fr" }),
  ),
  prefLabelLg2: mandatoryAndNotEmptyTextField(
    classificationsI18n.t("classification.title", { lng: "en" }),
  ),
  additionalMaterial: z.url().optional(),
  legalMaterial: z.url().optional(),
  homepage: z.url().optional(),
});

export const validate = formatValidation(ZodClassification);
