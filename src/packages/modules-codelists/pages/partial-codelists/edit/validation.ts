import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import MainDictionary from "../../../../deprecated-locales/build-dictionary";
import D, { D1, D2 } from "../../../i18n/build-dictionary";

const ZodPartialCodeList = z.object({
  id: mandatoryAndNotEmptyTextField(D.idTitle).regex(/^\w*$/, D.validCharactersProperty(D.idTitle)),
  parentCode: mandatoryAndNotEmptySelectField(D.parentCodelist),
  labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
  labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
  creator: mandatoryAndNotEmptySelectField(D.creator),
  disseminationStatus: mandatoryAndNotEmptySelectField(MainDictionary.disseminationStatusTitle),
});

export const validate = formatValidation(ZodPartialCodeList);
