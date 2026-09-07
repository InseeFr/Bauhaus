import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { structuresI18n } from "../../../i18n";

const ZodComponent = z.object({
  identifiant: mandatoryAndNotEmptyTextField(structuresI18n.t("component.notation")),
  labelLg1: mandatoryAndNotEmptyTextField(structuresI18n.t("component.label", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(structuresI18n.t("component.label", { lng: "en" })),
  type: mandatoryAndNotEmptySelectField(structuresI18n.t("component.type.title")),
});

export const validate = formatValidation(ZodComponent);
