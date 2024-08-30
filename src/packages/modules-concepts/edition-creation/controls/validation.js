import { htmlIsEmpty, htmlLength } from '../../../utils/html-utils';
import D, { D1 } from '../../../deprecated-locales';
import { z } from 'zod';
import { formatValidation } from '../../../utils/validation';

const Concept = (
	oldLabelLg1,
	conceptsWithLinks,
	maxLengthScopeNote,
	scopeNoteLg1CanBeEmpty
) =>
	z.object({
		prefLabelLg1: z
			.string({ required_error: D.mandatoryProperty(D1.labelTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D1.labelTitle) })
			.refine(
				(value) =>
					value === oldLabelLg1 ||
					!conceptsWithLinks.map((concept) => concept.label).includes(value),

				{ message: D.duplicatedLabel }
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
	general,
	notes,
	oldLabelLg1,
	conceptsWithLinks,
	maxLengthScopeNote
) =>
	formatValidation(
		Concept(
			oldLabelLg1,
			conceptsWithLinks,
			maxLengthScopeNote,
			general.disseminationStatus.includes('Prive')
		)
	)({
		...general,
		...notes,
	});
