import i18next from "../../../i18n";
import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

export const ZodStructure = z.object({
  identifiant: mandatoryAndNotEmptyTextField(i18next.t("structure.notation")),
  labelLg1: mandatoryAndNotEmptyTextField(i18next.t("structure.label", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(i18next.t("structure.label", { lng: "en" })),
});

export const validate = formatValidation(ZodStructure);
