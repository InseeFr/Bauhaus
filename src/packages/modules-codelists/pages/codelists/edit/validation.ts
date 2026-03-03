import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import MainDictionary from "../../../../deprecated-locales/build-dictionary";
import D, { D1, D2 } from "../../../i18n/build-dictionary";

const ZodCodeList = z.object({
  lastListUriSegment: mandatoryAndNotEmptyTextField(D.lastListUriSegmentTitleShort),
  lastCodeUriSegment: mandatoryAndNotEmptyTextField(D.lastCodeUriSegmentTitleShort),
  lastClassUriSegment: mandatoryAndNotEmptyTextField(D.lastClassUriSegmentTitleShort),
  id: mandatoryAndNotEmptyTextField(D.idTitle),
  labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
  labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
  creator: mandatoryAndNotEmptySelectField(D.creator),
  disseminationStatus: mandatoryAndNotEmptySelectField(MainDictionary.disseminationStatusTitle),
});

export const validate = formatValidation(ZodCodeList);
