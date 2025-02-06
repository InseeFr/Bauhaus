import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyMultiSelectField,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';
import { Dataset } from '../../../model/Dataset';

const ZodDataset = z.object({
	labelLg1: mandatoryAndNotEmptyTextField(D1.title),
	labelLg2: mandatoryAndNotEmptyTextField(D2.title),
	altIdentifier: z
		.string()
		.regex(/^[a-zA-Z0-9-_]+$/, { message: D.altIdError })
		.or(z.string().trim().length(0))
		.optional(),
	creator: mandatoryAndNotEmptySelectField(D.creatorTitle),
	contributor: mandatoryAndNotEmptyMultiSelectField(D.contributorsTitle),
	disseminationStatus: mandatoryAndNotEmptySelectField(
		D.disseminationStatusTitle,
	),
	dataStructure: z.string().url().optional(),
	wasGeneratedIRIs: mandatoryAndNotEmptyMultiSelectField(D.generatedBy),
});

export const validate = ({ catalogRecord, ...otherFields }: Dataset) =>
	formatValidation(ZodDataset)({
		creator: catalogRecord?.creator,
		contributor: catalogRecord?.contributor,
		...otherFields,
	});
