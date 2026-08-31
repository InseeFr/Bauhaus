import { z } from "zod";

import { arrayKeepUniqueField } from "@utils/array-utils";
import { normalize } from "@utils/string-utils";
import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import conceptsI18n from "../../../i18n";
import { CollectionGeneral } from "../../../../model/concepts/collection";

const t1 = conceptsI18n.getFixedT("fr");
const t = (key: string) => conceptsI18n.t(key) as string;

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
    id: mandatoryAndNotEmptyTextField(t("common.identifiantTitle")).refine(
      (value) => value.length === 0 || COLLECTION_ID_PATTERN.test(value),
      { error: t("common.invalidId") },
    ),
    prefLabelLg1: mandatoryAndNotEmptyTextField(t1("common.labelTitle")).refine(
      (value) =>
        value === initialPrefLabelLg1 ||
        !arrayKeepUniqueField(collectionList, "label").includes(normalize(value)),
      { error: t("common.duplicatedLabel") },
    ),
    creator: mandatoryAndNotEmptySelectField(t("common.creatorTitle")),
  });

export const validate = (
  general: CollectionGeneral,
  collectionList: CollectionsList,
  initialId: string,
  initialPrefLabelLg1: string,
) => formatValidation(ZodCollection(collectionList, initialId, initialPrefLabelLg1))(general);
