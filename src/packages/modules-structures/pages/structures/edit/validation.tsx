import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import { structuresI18n } from "../../../i18n";

export const ZodStructure = z.object({
  identifiant: mandatoryAndNotEmptyTextField(structuresI18n.t("structure.notation")),
  labelLg1: mandatoryAndNotEmptyTextField(structuresI18n.t("structure.label", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(structuresI18n.t("structure.label", { lng: "en" })),
});

export const validate = formatValidation(ZodStructure);
