import { z } from "zod";

import { arrayKeepUniqueField } from "@utils/array-utils";
import { normalize } from "@utils/string-utils";
import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import D, { D1 } from "../../../../deprecated-locales";
import { Collection } from "../../../../model/concepts/collection";

type CollectionsList = {
  id: string;
  label: string;
}[];

export const COLLECTION_ID_PATTERN = /^[A-Za-z0-9-]+$/;

const ZodCollection = (
  collectionList: CollectionsList,
  initialId: string,
  initialPrefLabelLg1: string,
) =>
  z.object({
    id: mandatoryAndNotEmptyTextField(D.identifiantTitle).refine(
      (value) => value.length === 0 || COLLECTION_ID_PATTERN.test(value),
      { error: D.invalidId },
    ),
    prefLabelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle).refine(
      (value) =>
        value === initialPrefLabelLg1 ||
        !arrayKeepUniqueField(collectionList, "label").includes(normalize(value)),
      { error: D.duplicatedLabel },
    ),
    creator: mandatoryAndNotEmptySelectField(D.creatorTitle),
  });

export const validate = (
  general: Collection,
  collectionList: CollectionsList,
  initialId: string,
  initialPrefLabelLg1: string,
) => formatValidation(ZodCollection(collectionList, initialId, initialPrefLabelLg1))(general);
