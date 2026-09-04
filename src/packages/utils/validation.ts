import { z, ZodObject } from "zod";

import { appI18n } from "../i18n";

export const formatValidation =
  (zodObject: ZodObject<any>) =>
  (values: any): { fields: Record<string, string>; errorMessage: string[] } => {
    const ZodError = zodObject.safeParse(values);

    const defaultFields = Object.keys(zodObject.shape).reduce(
      (acc, key) => ({
        ...acc,
        [key]: "",
      }),
      {} as Record<string, string>,
    );

    if (ZodError.success) {
      return {
        fields: defaultFields,
        errorMessage: [],
      };
    }

    const fields: Record<string, string> = {
      ...defaultFields,
      ...ZodError.error.issues.reduce(
        (acc, error) => ({
          ...acc,
          [error.path[0]]: error.message,
        }),
        {} as Record<string, string>,
      ),
    };

    const errorMessage = ZodError.error.issues.map((error) => error.message);

    return {
      fields,
      errorMessage,
    };
  };

export const mandatoryAndNotEmptyTextField = (property: string) => {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? appI18n.t("errors.mandatoryProperty", { propertyName: property })
          : "",
    })
    .trim()
    .min(1, { error: appI18n.t("errors.mandatoryProperty", { propertyName: property }) });
};

export const mandatoryAndNotEmptySelectField = (property: string) => {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? appI18n.t("errors.mandatoryProperty", { propertyName: property })
          : undefined,
    })
    .min(1, { error: appI18n.t("errors.mandatoryProperty", { propertyName: property }) });
};

export const mandatoryAndNotEmptyMultiSelectField = (property: string) => {
  return z
    .array(z.string(), {
      error: (issue) =>
        issue.input === undefined
          ? appI18n.t("errors.mandatoryProperty", { propertyName: property })
          : undefined,
    })
    .nonempty({
      error: appI18n.t("errors.mandatoryProperty", { propertyName: property }),
    });
};
