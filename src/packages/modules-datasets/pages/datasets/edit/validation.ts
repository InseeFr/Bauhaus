import i18next from "i18next";
import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptyMultiSelectField,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { Dataset } from "../../../../model/Dataset";

export const validate = ({ catalogRecord, ...otherFields }: Dataset) => {
  const ZodDataset = z.object({
    labelLg1: mandatoryAndNotEmptyTextField(
      i18next.t("dataset.globalInformation.mainTitle", { lng: "fr" }),
    ),
    labelLg2: mandatoryAndNotEmptyTextField(
      i18next.t("dataset.globalInformation.mainTitle", { lng: "en" }),
    ),
    altIdentifier: z
      .string()
      .regex(/^[a-zA-Z0-9-_]+$/, {
        error: i18next.t("dataset.internalManagement.altId.error"),
      })
      .or(z.string().trim().length(0))
      .optional(),
    creator: mandatoryAndNotEmptySelectField(i18next.t("dataset.internalManagement.creator")),
    contributor: mandatoryAndNotEmptyMultiSelectField(
      i18next.t("dataset.internalManagement.contributors"),
    ),
    disseminationStatus: mandatoryAndNotEmptySelectField(
      i18next.t("dataset.internalManagement.disseminationStatus"),
    ),
    wasGeneratedIRIs: mandatoryAndNotEmptyMultiSelectField(
      i18next.t("dataset.internalManagement.generatedBy"),
    ),
  });

  return formatValidation(ZodDataset)({
    creator: catalogRecord?.creator,
    contributor: catalogRecord?.contributor,
    ...otherFields,
  });
};
