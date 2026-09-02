import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptyMultiSelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import NewDictionary from "../../../../i18n";
import { operationsI18n } from "../../../i18n";

const Serie = z.object({
  id: z.string(),
  type: z.string(),
});

const ZodIndicator = z.object({
  prefLabelLg1: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "fr" })),
  prefLabelLg2: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "en" })),
  creators: mandatoryAndNotEmptyMultiSelectField(operationsI18n.t("app.creatorsTitle")),
  wasGeneratedBy: z.array(Serie).nonempty({
    error: NewDictionary.errors.mandatoryProperty(operationsI18n.t("common.generatedBy")),
  }),
});

export const validate = formatValidation(ZodIndicator);
