import { z, ZodObject } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptyMultiSelectField,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { operationsI18n } from "../../../i18n";

import NewDictionary from "../../../../i18n";

const ZodSerie: ZodObject<any> = z.object({
  family: z.object(
    {
      id: z
        .string({
          error: (issue) =>
            issue.input === undefined &&
            NewDictionary.errors.mandatoryProperty(operationsI18n.t("common.familyTitle")),
        })
        .trim()
        .min(1, {
          error: NewDictionary.errors.mandatoryProperty(operationsI18n.t("common.familyTitle")),
        }),
    },
    {
      error: (issue) =>
        issue.input === undefined &&
        NewDictionary.errors.mandatoryProperty(operationsI18n.t("common.familyTitle")),
    },
  ),
  prefLabelLg1: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "fr" })),
  prefLabelLg2: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "en" })),
  creators: mandatoryAndNotEmptyMultiSelectField(operationsI18n.t("app.creatorsTitle")),
});

const fieldToTitleMapping: Record<string, string> = {
  typeCode: operationsI18n.t("common.operationType"),
  accrualPeriodicityCode: operationsI18n.t("common.dataCollectFrequency"),
};

const addFieldsToObject = (listOfFields: string[], baseObject: ZodObject<any>) => {
  const shapeFromFields = Object.fromEntries(
    listOfFields.map((field) => [
      field,
      mandatoryAndNotEmptySelectField(fieldToTitleMapping[field] ?? ""),
    ]),
  );
  return z.object({
    ...baseObject.shape,
    ...shapeFromFields,
  });
};

export const validate = (extraMandatoryFields: string[]) => {
  if (!extraMandatoryFields) return formatValidation(ZodSerie);

  const ZodEnhancedSerie = addFieldsToObject(extraMandatoryFields, ZodSerie);

  return formatValidation(ZodEnhancedSerie);
};
