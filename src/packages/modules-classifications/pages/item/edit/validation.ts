import { classificationsI18n } from "../../../i18n";
import { z } from "zod";

import { ItemGeneral } from "@model/Classification";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

const ZodItem = (altLabelsLength: number) =>
  z.object({
    prefLabelLg1: mandatoryAndNotEmptyTextField(classificationsI18n.t("item.title", { lng: "fr" })),
    prefLabelLg2: mandatoryAndNotEmptyTextField(classificationsI18n.t("item.title", { lng: "en" })),
    altLabelsLg1_: z
      .string()
      .max(altLabelsLength, {
        error: classificationsI18n.t("item.altLabelError", {
          length: altLabelsLength,
          lng: "fr",
        }),
      })
      .optional(),
    altLabelsLg2_: z
      .string()
      .max(altLabelsLength, {
        error: classificationsI18n.t("item.altLabelError", {
          length: altLabelsLength,
          lng: "en",
        }),
      })
      .optional(),
  });

export const validate = (item: ItemGeneral, altLabelsLength: string) =>
  formatValidation(ZodItem(Number(altLabelsLength)))(item);
