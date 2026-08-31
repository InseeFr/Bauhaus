import { codelistsI18n } from "../../../i18n";
import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

const ZodPartialCodeList = z.object({
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

export const validate = formatValidation(ZodPartialCodeList);
