import datasetsI18n from "../../../i18n";
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
      datasetsI18n.t("dataset.globalInformation.mainTitle", { lng: "fr" }),
    ),
    labelLg2: mandatoryAndNotEmptyTextField(
      datasetsI18n.t("dataset.globalInformation.mainTitle", { lng: "en" }),
    ),
    altIdentifier: z
      .string()
      .regex(/^[a-zA-Z0-9-_]+$/, {
        error: datasetsI18n.t("dataset.internalManagement.altId.error"),
      })
      .or(z.string().trim().length(0))
      .optional(),
    creator: mandatoryAndNotEmptySelectField(datasetsI18n.t("dataset.internalManagement.creator")),
    contributor: mandatoryAndNotEmptyMultiSelectField(
      datasetsI18n.t("dataset.internalManagement.contributors"),
    ),
    disseminationStatus: mandatoryAndNotEmptySelectField(
      datasetsI18n.t("dataset.internalManagement.disseminationStatus"),
    ),
    wasGeneratedIRIs: mandatoryAndNotEmptyMultiSelectField(
      datasetsI18n.t("dataset.internalManagement.generatedBy"),
    ),
  });

  return formatValidation(ZodDataset)({
    creator: catalogRecord?.creator,
    contributor: catalogRecord?.contributor,
    ...otherFields,
  });
};
