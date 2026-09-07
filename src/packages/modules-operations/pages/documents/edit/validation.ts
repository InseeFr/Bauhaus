import { z } from "zod";

import { Document } from "@model/operations/document";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import { LINK } from "../../../../constants/documentType";
import { appI18n } from "../../../../i18n";
import { operationsI18n } from "../../../i18n";

const Base = (
  documentsAndLinksList: Document[],
  currentLabelLg1: string | undefined,
  currentLabelLg2: string | undefined,
) =>
  z.object({
    labelLg1: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "fr" })).refine(
      (value) =>
        value === currentLabelLg1 ||
        !documentsAndLinksList.map((document: Document) => document.labelLg1).includes(value),

      { error: operationsI18n.t("app.duplicatedTitle") },
    ),
    labelLg2: mandatoryAndNotEmptyTextField(operationsI18n.t("common.title", { lng: "en" })).refine(
      (value) =>
        value === currentLabelLg2 ||
        !documentsAndLinksList.map((document: Document) => document.labelLg2).includes(value),

      { error: operationsI18n.t("app.duplicatedTitle") },
    ),
    lang: mandatoryAndNotEmptySelectField(operationsI18n.t("app.langTitle")),
  });

const ZodLink = (
  documentsAndLinksList: Document[],
  currentLabelLg1: string | undefined,
  currentLabelLg2: string | undefined,
) =>
  Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
    url: z
      .url({
        protocol: /^https?$/,
        error: (issue) =>
          issue.input === undefined
            ? appI18n.t("errors.mandatoryProperty", {
                propertyName: operationsI18n.t("documents.titleLink"),
              })
            : operationsI18n.t("validation.badUrl"),
      })
      .trim()
      .min(1, {
        error: appI18n.t("errors.mandatoryProperty", {
          propertyName: operationsI18n.t("documents.titleLink"),
        }),
      }),
  });

const File = z.object({
  name: z.string().regex(/^(.+\/)?[a-zA-Z0-9-_.]+$/, {
    error: operationsI18n.t("validation.wrongFileName"),
  }),
});

const ZodDocument = (
  documentsAndLinksList: Document[],
  currentLabelLg1: string | undefined,
  currentLabelLg2: string | undefined,
) =>
  Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
    updatedDate: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? operationsI18n.t("validation.requiredUpdatedDate")
            : undefined,
      })
      .min(1, { error: operationsI18n.t("validation.requiredUpdatedDate") })
      .nullable()
      .refine((value) => value !== null, {
        error: operationsI18n.t("validation.requiredUpdatedDate"),
      }),
    files: z.array(File).nonempty({
      error: operationsI18n.t("validation.requiredFile"),
    }),
  });

export const validate = (
  document: Document,
  type: string,
  documentsAndLinksList: Document[],
  currentLabelLg1: string | undefined,
  currentLabelLg2: string | undefined,
) =>
  formatValidation(
    type === LINK
      ? ZodLink(documentsAndLinksList, currentLabelLg1, currentLabelLg2)
      : ZodDocument(documentsAndLinksList, currentLabelLg1, currentLabelLg2),
  )(document);
