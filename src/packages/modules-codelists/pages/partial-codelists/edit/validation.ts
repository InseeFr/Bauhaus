import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { codelistsI18n } from "../../../i18n";

const ZodPartialCodelist = z.object({
  id: mandatoryAndNotEmptyTextField(codelistsI18n.t("partial-codelists.identifier")).regex(
    /^\w*$/,
    codelistsI18n.t("partial-codelists.invalidCharactersError"),
  ),
  parentCode: mandatoryAndNotEmptySelectField(codelistsI18n.t("partial-codelists.parentCodelist")),
  labelLg1: mandatoryAndNotEmptyTextField(
    codelistsI18n.t("partial-codelists.label", { lng: "fr" }),
  ),
  labelLg2: mandatoryAndNotEmptyTextField(
    codelistsI18n.t("partial-codelists.label", { lng: "en" }),
  ),
  creator: mandatoryAndNotEmptySelectField(codelistsI18n.t("partial-codelists.creator")),
  disseminationStatus: mandatoryAndNotEmptySelectField(
    codelistsI18n.t("partial-codelists.disseminationStatus"),
  ),
});

export const validate = formatValidation(ZodPartialCodelist);
