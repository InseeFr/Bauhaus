import { z } from 'zod';

import { htmlIsEmpty, htmlLength } from '@utils/html-utils';
import { formatValidation } from '@utils/validation';

import D, { D1 } from '../../../deprecated-locales';
import { ConceptGeneral, ConceptNotes } from '../../../model/concepts/concept';

type Concept = {
	id: string;
	label: string;
};

type ConceptsList = Concept[];

const ZodConcept = (
	oldLabelLg1: string,
	conceptsWithLinks: ConceptsList,
	maxLengthScopeNote: number,
	scopeNoteLg1CanBeEmpty: boolean,
) =>
	z.object({
		prefLabelLg1: z
			.string({ required_error: D.mandatoryProperty(D1.labelTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D1.labelTitle) })
			.refine(
				(value) =>
					value === oldLabelLg1 ||
					!conceptsWithLinks
						.map((concept: Concept) => concept.label)
						.includes(value),

				{ message: D.duplicatedLabel },
			),
		creator: z
			.string({ required_error: D.mandatoryProperty(D.creatorTitle) })
			.min(1, { message: D.mandatoryProperty(D.creatorTitle) }),
		disseminationStatus: z
			.string({
				required_error: D.mandatoryProperty(D.disseminationStatusTitle),
			})
			.min(1, { message: D.mandatoryProperty(D.disseminationStatusTitle) }),
		scopeNoteLg1: z
			.string()
			.refine((value) => htmlLength(value) <= maxLengthScopeNote, {
				message: D.tooLongScopeNote(maxLengthScopeNote),
			})
			.refine((value) => scopeNoteLg1CanBeEmpty || !htmlIsEmpty(value), {
				message: D.emptyScopeNoteLg1,
			}),
		scopeNoteLg2: z
			.string()
			.refine((value) => htmlLength(value) <= maxLengthScopeNote, {
				message: D.tooLongScopeNote(maxLengthScopeNote),
			}),
		definitionLg1: z.string().refine((value) => !htmlIsEmpty(value), {
			message: D.emptyDefinitionLg1,
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
			!general?.disseminationStatus?.includes('Public'),
		),
	)({
		...general,
		...notes,
	});
