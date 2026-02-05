import i18next from "i18next";

import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptyMultiSelectField,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { Dataset } from "../../../../model/Dataset";

const tFr = i18next.getFixedT("fr");
const tEn = i18next.getFixedT("en");

const ZodDataset = z.object({
  labelLg1: mandatoryAndNotEmptyTextField(tFr("dataset.globalInformation.mainTitle")),
  labelLg2: mandatoryAndNotEmptyTextField(tEn("dataset.globalInformation.mainTitle")),
  altIdentifier: z
    .string()
    .regex(/^[a-zA-Z0-9-_]+$/, {
      error: i18next.t("dataset.internalManagement.altId.error"),
    })
    .or(z.string().trim().length(0))
    .optional(),
  creator: mandatoryAndNotEmptySelectField(i18next.t("dataset.internalManagement.creator")),
  contributor: mandatoryAndNotEmptyMultiSelectField(
    i18next.t("dataset.internalManagement.contributor"),
  ),
  disseminationStatus: mandatoryAndNotEmptySelectField(
    i18next.t("dataset.internalManagement.disseminationStatus"),
  ),
  wasGeneratedIRIs: mandatoryAndNotEmptyMultiSelectField(
    i18next.t("dataset.internalManagement.generatedBy"),
  ),
});

export const validate = ({ catalogRecord, ...otherFields }: Dataset) =>
  formatValidation(ZodDataset)({
    creator: catalogRecord?.creator,
    contributor: catalogRecord?.contributor,
    ...otherFields,
  });
