import { htmlIsEmpty, htmlLength } from '../../../utils/html-utils';
import D, { D1 } from '../../../deprecated-locales';
import { z } from 'zod';
import { formatValidation } from '../../../utils/validation';

const Concept = (oldLabelLg1, conceptsWithLinks, maxLengthScopeNote) =>
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

		scopeNoteLg1: z
			.string()
			.refine((value) => htmlLength(value) <= maxLengthScopeNote, {
				message: D.tooLongScopeNote(maxLengthScopeNote),
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

const disseminationStatusEnum = z.enum([
	'Privé',
	'Public générique',
	'Public spécifique',
]);

const ScopeNoteAndDisseminationStatus = z.discriminatedUnion(
	'disseminationStatus',
	[
		z.object({
			disseminationStatus: disseminationStatusEnum.extract(['Privé']),
			scopeNoteLg1: z.string().refine((value) => !htmlIsEmpty(value), {
				message: D.emptyScopeNoteLg1,
			}),
		}),
		z.object({
			disseminationStatus: disseminationStatusEnum.extract([
				'Public générique',
				'Public spécifique',
			]),
			scopeNoteLg1: z
				.string()
				.refine((value) => !htmlIsEmpty(value), {
					message: D.emptyScopeNoteLg1,
				})
				.optional(),
		}),
	]
);

// disseminationStatus: z.string({ required_error: D.mandatoryProperty(D.disseminationStatusTitle) }).min(1, { message: D.mandatoryProperty(D.disseminationStatusTitle) })

export const validate = (
	general,
	notes,
	oldLabelLg1,
	conceptsWithLinks,
	maxLengthScopeNote
) =>
	formatValidation(
		Concept(oldLabelLg1, conceptsWithLinks, maxLengthScopeNote).extend(
			ScopeNoteAndDisseminationStatus
		)
	)({ ...general, ...notes });

export const scndWithoutFirst = (first, second) => {
	return !htmlIsEmpty(second) && htmlIsEmpty(first);
};

export const checkPrefLabelLg1Existing = (
	concepts,
	prefLabelLg1,
	initialPrefLabelFr
) => {
	return (
		prefLabelLg1 !== initialPrefLabelFr &&
		concepts.map((concept) => concept.label).includes(prefLabelLg1)
	);
};

export const validatee = (
	general,
	notes,
	oldLabelLg1,
	conceptsWithLinks,
	maxLengthScopeNote
) => {
	const errorMessage = [];
	const fields = {};

	// const isPrefLabelLg1Existing = checkPrefLabelLg1Existing(
	// 	conceptsWithLinks,
	// 	general.prefLabelLg1,
	// 	oldLabelLg1
	// );

	// if (!general.prefLabelLg1) {
	// 	errorMessage.push(D.mandatoryProperty(D1.labelTitle));
	// 	fields.prefLabelLg1 = D.mandatoryProperty(D1.labelTitle);
	// }

	// if (isPrefLabelLg1Existing) {
	// 	errorMessage.push(D.duplicatedLabel);
	// 	fields.prefLabelLg1 = D.duplicatedLabel;
	// }

	// if (!general.creator) {
	// 	errorMessage.push(D.mandatoryProperty(D.creatorTitle));
	// 	fields.creator = D.mandatoryProperty(D.creatorTitle);
	// }

	// if (!general.disseminationStatus) {
	// 	errorMessage.push(D.mandatoryProperty(D.disseminationStatusTitle));
	// 	fields.disseminationStatus = D.mandatoryProperty(
	// 		D.disseminationStatusTitle
	// 	);
	// }

	// if (htmlIsEmpty(notes.definitionLg1)) {
	// 	errorMessage.push(D.emptyDefinitionLg1);
	// 	fields.definitionLg1 = D.emptyDefinitionLg1;
	// }

	// const isStatusPublicAndEmptyScopeNote =
	// 	general.disseminationStatus.includes('Public') &&
	// 	htmlIsEmpty(notes.scopeNoteLg1);

	// if (isStatusPublicAndEmptyScopeNote) {
	// 	errorMessage.push(D.emptyScopeNoteLg1);
	// 	fields.scopeNoteLg1 = D.emptyScopeNoteLg1;
	// }

	const hasScopeNoteLg2NotLg1 = scndWithoutFirst(
		notes.scopeNoteLg1,
		notes.scopeNoteLg2
	);

	if (hasScopeNoteLg2NotLg1) {
		errorMessage.push(D.hasScopeNoteLg2NotLg1);
		fields.scopeNoteLg1 = D.hasScopeNoteLg2NotLg1;
	}

	// if (htmlLength(notes.scopeNoteLg1) > maxLengthScopeNote) {
	// 	errorMessage.push(D.tooLongScopeNote(maxLengthScopeNote));
	// 	fields.scopeNoteLg1 = D.tooLongScopeNote(maxLengthScopeNote);
	// }

	// if (htmlLength(notes.scopeNoteLg2) > maxLengthScopeNote) {
	// 	errorMessage.push(D.tooLongScopeNote(maxLengthScopeNote));
	// 	fields.scopeNoteLg2 = D.tooLongScopeNote(maxLengthScopeNote);
	// }

	const hasEditorialNoteLg2NotLg1 = scndWithoutFirst(
		notes.editorialNoteLg1,
		notes.editorialNoteLg2
	);

	if (hasEditorialNoteLg2NotLg1) {
		errorMessage.push(D.hasEditorialNoteLg2NotLg1);
		fields.editorialNoteLg1 = D.hasEditorialNoteLg2NotLg1;
	}

	const hasChangeNoteLg2NotLg1 = scndWithoutFirst(
		notes.changeNoteLg1,
		notes.changeNoteLg2
	);

	if (hasChangeNoteLg2NotLg1) {
		errorMessage.push(D.hasChangeNoteLg2NotLg1);
		fields.changeNoteLg1 = D.hasChangeNoteLg2NotLg1;
	}

	return { errorMessage, fields };
};
