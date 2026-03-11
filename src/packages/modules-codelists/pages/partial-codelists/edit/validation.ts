import i18next from "i18next";
import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

const ZodPartialCodeList = z.object({
  id: mandatoryAndNotEmptyTextField(i18next.t("partial-codelists.identifier")).regex(
    /^\w*$/,
    i18next.t("partial-codelists.invalidCharactersError"),
  ),
  parentCode: mandatoryAndNotEmptySelectField(i18next.t("partial-codelists.parentCodelist")),
  labelLg1: mandatoryAndNotEmptyTextField(i18next.t("partial-codelists.label", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(i18next.t("partial-codelists.label", { lng: "en" })),
  creator: mandatoryAndNotEmptySelectField(i18next.t("partial-codelists.creator")),
  disseminationStatus: mandatoryAndNotEmptySelectField(
    i18next.t("partial-codelists.disseminationStatus"),
  ),
});

export const validate = formatValidation(ZodPartialCodeList);
