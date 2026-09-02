import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { codelistsI18n } from "../../../i18n";

const ZodCodeList = z.object({
  lastListUriSegment: mandatoryAndNotEmptyTextField(codelistsI18n.t("codelists.codelistURI")),
  lastCodeUriSegment: mandatoryAndNotEmptyTextField(codelistsI18n.t("codelists.codesURI")),
  lastClassUriSegment: mandatoryAndNotEmptyTextField(codelistsI18n.t("codelists.classURI")),
  id: mandatoryAndNotEmptyTextField(codelistsI18n.t("codelists.identifier")),
  labelLg1: mandatoryAndNotEmptyTextField(codelistsI18n.t("codelists.label", { lng: "fr" })),
  labelLg2: mandatoryAndNotEmptyTextField(codelistsI18n.t("codelists.label", { lng: "en" })),
  creator: mandatoryAndNotEmptySelectField(codelistsI18n.t("codelists.creator")),
  disseminationStatus: mandatoryAndNotEmptySelectField(
    codelistsI18n.t("codelists.disseminationStatus"),
  ),
});

export const validate = formatValidation(ZodCodeList);
