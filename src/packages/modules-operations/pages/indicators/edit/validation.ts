import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptyMultiSelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import i18next from "i18next";

import NewDictionary from "../../../../i18n";

const Serie = z.object({
  id: z.string(),
  type: z.string(),
});

const ZodIndicator = z.object({
  prefLabelLg1: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "fr" })),
  prefLabelLg2: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "en" })),
  creators: mandatoryAndNotEmptyMultiSelectField(i18next.t("app.creatorsTitle")),
  wasGeneratedBy: z.array(Serie).nonempty({
    error: NewDictionary.errors.mandatoryProperty(i18next.t("common.generatedBy")),
  }),
});

export const validate = formatValidation(ZodIndicator);
