import { z } from "zod";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import operationsI18n from "../../../i18n";

const ZodFamily = z.object({
  prefLabelLg1: mandatoryAndNotEmptyTextField(
    operationsI18n.t("common.title", { lng: "fr" }) as string,
  ),
  prefLabelLg2: mandatoryAndNotEmptyTextField(
    operationsI18n.t("common.title", { lng: "en" }) as string,
  ),
});

export const validate = formatValidation(ZodFamily);
