import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import i18next from "i18next";

import NewDictionary from "../../../../i18n";

const ZodOperation = z.object({
  series: z.object(
    {
      id: z
        .string({
          error: (issue) =>
            issue.input === undefined &&
            NewDictionary.errors.mandatoryProperty(i18next.t("common.serieTitle")),
        })
        .trim()
        .min(1, {
          error: NewDictionary.errors.mandatoryProperty(i18next.t("common.serieTitle")),
        }),
    },
    {
      error: (issue) =>
        issue.input === undefined && NewDictionary.errors.mandatoryProperty(i18next.t("common.serieTitle")),
    },
  ),
  prefLabelLg1: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "fr" })),
  prefLabelLg2: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "en" })),
  year: z.coerce
    .number({ error: i18next.t("app.numberProperty", { propertyName: i18next.t("common.year", { lng: "fr" }) }) })
    .int({ error: i18next.t("app.numberProperty", { propertyName: i18next.t("common.year", { lng: "fr" }) }) })
    .optional(),
});

export const validate = formatValidation(ZodOperation);
