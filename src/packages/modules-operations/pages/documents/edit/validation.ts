import { z } from "zod";

import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import i18next from "i18next";

import NewDictionary from "../../../../i18n";
import { Document } from "../../../../model/operations/document";
import { LINK } from "../../../constants/documentType";

const Base = (
  documentsAndLinksList: Document[],
  currentLabelLg1: string,
  currentLabelLg2: string,
) =>
  z.object({
    labelLg1: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "fr" })).refine(
      (value) =>
        value === currentLabelLg1 ||
        !documentsAndLinksList.map((document: Document) => document.labelLg1).includes(value),

      { error: i18next.t("app.duplicatedTitle") },
    ),
    labelLg2: mandatoryAndNotEmptyTextField(i18next.t("common.title", { lng: "en" })).refine(
      (value) =>
        value === currentLabelLg2 ||
        !documentsAndLinksList.map((document: Document) => document.labelLg2).includes(value),

      { error: i18next.t("app.duplicatedTitle") },
    ),
    lang: mandatoryAndNotEmptySelectField(i18next.t("app.langTitle")),
  });

const ZodLink = (
  documentsAndLinksList: Document[],
  currentLabelLg1: string,
  currentLabelLg2: string,
) =>
  Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
    url: z
      .url({
        protocol: /^https?$/,
        error: (issue) =>
          issue.input === undefined
            ? NewDictionary.errors.mandatoryProperty(i18next.t("documents.titleLink"))
            : i18next.t("validation.badUrl"),
      })
      .trim()
      .min(1, { error: NewDictionary.errors.mandatoryProperty(i18next.t("documents.titleLink")) }),
  });

const File = z.object({
  name: z.string().regex(/^(.+\/)?[a-zA-Z0-9-_.]+$/, { error: i18next.t("validation.wrongFileName") }),
});

const ZodDocument = (
  documentsAndLinksList: Document[],
  currentLabelLg1: string,
  currentLabelLg2: string,
) =>
  Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
    updatedDate: z
      .string({
        error: (issue) => issue.input === undefined && i18next.t("validation.requiredUpdatedDate"),
      })
      .min(1, { error: i18next.t("validation.requiredUpdatedDate") })
      .nullable()
      .refine((value) => value !== null, { error: i18next.t("validation.requiredUpdatedDate") }),
    files: z.array(File).nonempty({
      error: i18next.t("validation.requiredFile"),
    }),
  });

export const validate = (
  document: Document,
  type: string,
  documentsAndLinksList: Document[],
  currentLabelLg1: string,
  currentLabelLg2: string,
) =>
  formatValidation(
    type === LINK
      ? ZodLink(documentsAndLinksList, currentLabelLg1, currentLabelLg2)
      : ZodDocument(documentsAndLinksList, currentLabelLg1, currentLabelLg2),
  )(document);
