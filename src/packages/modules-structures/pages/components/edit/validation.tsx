import i18next from "../../../i18n";
import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

const ZodComponent = z.object({
  identifiant: mandatoryAndNotEmptyTextField(i18next.t("component.notation")),
  labelLg1: mandatoryAndNotEmptyTextField(i18next.t("component.label", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(i18next.t("component.label", { lng: "en" })),
  type: mandatoryAndNotEmptySelectField(i18next.t("component.type.title")),
});

export const validate = formatValidation(ZodComponent);
