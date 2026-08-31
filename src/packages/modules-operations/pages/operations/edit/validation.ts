import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import { operationsI18n } from "../../../i18n";

import NewDictionary from "../../../../i18n";

const ZodOperation = z.object({
  series: z.object(
    {
      id: z
        .string({
          error: (issue) =>
            issue.input === undefined &&
            NewDictionary.errors.mandatoryProperty(operationsI18n.t("common.serieTitle")),
        })
        .trim()
        .min(1, {
          error: NewDictionary.errors.mandatoryProperty(operationsI18n.t("common.serieTitle")),
        }),
    },
    {
      error: (issue) =>
        issue.input === undefined &&
        NewDictionary.errors.mandatoryProperty(operationsI18n.t("common.serieTitle")),
    },
  ),
  prefLabelLg1: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "fr" })),
  prefLabelLg2: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "en" })),
  year: z.coerce
    .number({
      error: operationsI18n.t("app.numberProperty", {
        propertyName: operationsI18n.t("common.year", { lng: "fr" }),
      }),
    })
    .int({
      error: operationsI18n.t("app.numberProperty", {
        propertyName: operationsI18n.t("common.year", { lng: "fr" }),
      }),
    })
    .optional(),
});

export const validate = formatValidation(ZodOperation);
