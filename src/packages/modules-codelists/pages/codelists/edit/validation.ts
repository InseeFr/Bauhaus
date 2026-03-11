import i18next from "i18next";
import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

const ZodCodeList = z.object({
  lastListUriSegment: mandatoryAndNotEmptyTextField(i18next.t("codelists.codelistURI")),
  lastCodeUriSegment: mandatoryAndNotEmptyTextField(i18next.t("codelists.codesURI")),
  lastClassUriSegment: mandatoryAndNotEmptyTextField(i18next.t("codelists.classURI")),
  id: mandatoryAndNotEmptyTextField(i18next.t("codelists.identifier")),
  labelLg1: mandatoryAndNotEmptyTextField(i18next.t("codelists.label", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(i18next.t("codelists.label", { lng: "en" })),
  creator: mandatoryAndNotEmptySelectField(i18next.t("codelists.creator")),
  disseminationStatus: mandatoryAndNotEmptySelectField(i18next.t("codelists.disseminationStatus")),
});

export const validate = formatValidation(ZodCodeList);
