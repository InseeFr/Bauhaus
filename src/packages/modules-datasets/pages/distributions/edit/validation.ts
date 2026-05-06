import i18next from "i18next";
import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

const ZodDistribution = z.object({
  idDataset: mandatoryAndNotEmptySelectField(i18next.t("dataset.title")),
  labelLg1: mandatoryAndNotEmptyTextField(i18next.t("distribution.mainTitle", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(i18next.t("distribution.mainTitle", { lng: "en" })),
  accessUrl: z
    .url({
      error: i18next.t("distribution.URLerror"),
    })
    .or(z.literal(""))
    .optional(),
  url: z
    .url({
      error: i18next.t("distribution.URLerror"),
    })
    .or(z.literal(""))
    .optional(),
});

export const validate = formatValidation(ZodDistribution);
