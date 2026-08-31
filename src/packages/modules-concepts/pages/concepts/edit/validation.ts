import { z } from "zod";

import { htmlIsEmpty, htmlLength } from "@utils/html-utils";
import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import conceptsI18n from "../../../i18n";
import { ConceptGeneral, ConceptNotes } from "../../../../model/concepts/concept";

const t1 = conceptsI18n.getFixedT("fr");
const t = (key: string, options?: Record<string, unknown>): string =>
  conceptsI18n.t(key, options as never) as unknown as string;

interface Concept {
  id: string;
  label: string;
}

type ConceptsList = Concept[];

const ZodConcept = (
  oldLabelLg1: string,
  conceptsWithLinks: ConceptsList,
  maxLengthScopeNote: number,
  scopeNoteLg1CanBeEmpty: boolean,
) =>
  z.object({
    prefLabelLg1: mandatoryAndNotEmptyTextField(t1("common.labelTitle")).refine(
      (value) =>
        value === oldLabelLg1 ||
        !conceptsWithLinks.map((concept: Concept) => concept.label).includes(value),
      { error: t("common.duplicatedLabel") },
    ),
    creator: mandatoryAndNotEmptySelectField(t("common.creatorTitle")),
    disseminationStatus: mandatoryAndNotEmptySelectField(t("common.disseminationStatusTitle")),
    scopeNoteLg1: z
      .string()
      .refine((value) => htmlLength(value) <= maxLengthScopeNote, {
        error: t("concept.notes.tooLongScopeNote", { max: maxLengthScopeNote }),
      })
      .refine((value) => scopeNoteLg1CanBeEmpty || !htmlIsEmpty(value), {
        error: t("concept.notes.emptyScopeNoteLg1"),
      }),
    scopeNoteLg2: z.string().refine((value) => htmlLength(value) <= maxLengthScopeNote, {
      error: t("concept.notes.tooLongScopeNote", { max: maxLengthScopeNote }),
    }),
    definitionLg1: z.string().refine((value) => !htmlIsEmpty(value), {
      error: t("concept.notes.emptyDefinitionLg1"),
    }),
  });

export const validate = (
  general: ConceptGeneral,
  notes: ConceptNotes,
  oldLabelLg1: string,
  conceptsWithLinks: ConceptsList,
  maxLengthScopeNote: number,
) =>
  formatValidation(
    ZodConcept(
      oldLabelLg1,
      conceptsWithLinks,
      maxLengthScopeNote,
      !general?.disseminationStatus?.includes("Public"),
    ),
  )({
    ...general,
    ...notes,
  });
