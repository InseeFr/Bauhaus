import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { datasetsI18n } from "../../../i18n";

const ZodDistribution = z.object({
  idDataset: mandatoryAndNotEmptySelectField(datasetsI18n.t("dataset.title")),
  labelLg1: mandatoryAndNotEmptyTextField(datasetsI18n.t("distribution.mainTitle", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(datasetsI18n.t("distribution.mainTitle", { lng: "en" })),
  accessUrl: z
    .url({
      error: datasetsI18n.t("distribution.URLerror"),
    })
    .or(z.literal(""))
    .optional(),
  url: z
    .url({
      error: datasetsI18n.t("distribution.URLerror"),
    })
    .or(z.literal(""))
    .optional(),
});

export const validate = formatValidation(ZodDistribution);
