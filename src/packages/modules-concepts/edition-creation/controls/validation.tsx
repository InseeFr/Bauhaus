import { z } from "zod";

import { htmlIsEmpty, htmlLength } from "@utils/html-utils";
import {
  formatValidation,
  mandatoryAndNotEmptySelectField,
  mandatoryAndNotEmptyTextField,
} from "@utils/validation";

import D, { D1 } from "../../../deprecated-locales";
import { ConceptGeneral, ConceptNotes } from "../../../model/concepts/concept";

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
    prefLabelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle).refine(
      (value) =>
        value === oldLabelLg1 ||
        !conceptsWithLinks.map((concept: Concept) => concept.label).includes(value),
      { error: D.duplicatedLabel },
    ),
    creator: mandatoryAndNotEmptySelectField(D.creatorTitle),
    disseminationStatus: mandatoryAndNotEmptySelectField(D.disseminationStatusTitle),
    scopeNoteLg1: z
      .string()
      .refine((value) => htmlLength(value) <= maxLengthScopeNote, {
        error: D.tooLongScopeNote(maxLengthScopeNote),
      })
      .refine((value) => scopeNoteLg1CanBeEmpty || !htmlIsEmpty(value), {
        error: D.emptyScopeNoteLg1,
      }),
    scopeNoteLg2: z.string().refine((value) => htmlLength(value) <= maxLengthScopeNote, {
      error: D.tooLongScopeNote(maxLengthScopeNote),
    }),
    definitionLg1: z.string().refine((value) => !htmlIsEmpty(value), {
      error: D.emptyDefinitionLg1,
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
