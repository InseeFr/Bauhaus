import i18next from "../../../i18n";
import { z } from "zod";

import { ItemGeneral } from "@model/Classification";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

const ZodItem = (altLabelsLength: number) =>
  z.object({
    prefLabelLg1: mandatoryAndNotEmptyTextField(i18next.t("item.title", { lng: "fr" })),
    prefLabelLg2: mandatoryAndNotEmptyTextField(i18next.t("item.title", { lng: "en" })),
    altLabelsLg1_: z
      .string()
      .max(altLabelsLength, {
        error: i18next.t("item.altLabelError", { length: altLabelsLength, lng: "fr" }),
      })
      .optional(),
    altLabelsLg2_: z
      .string()
      .max(altLabelsLength, {
        error: i18next.t("item.altLabelError", { length: altLabelsLength, lng: "en" }),
      })
      .optional(),
  });

export const validate = (item: ItemGeneral, altLabelsLength: string) =>
  formatValidation(ZodItem(Number(altLabelsLength)))(item);
