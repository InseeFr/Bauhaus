import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import i18next from "i18next";

const ZodFamily = z.object({
  prefLabelLg1: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "fr" }) as string),
  prefLabelLg2: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "en" }) as string),
});

export const validate = formatValidation(ZodFamily);
