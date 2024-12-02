import { z } from 'zod';

import { formatValidation } from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';
import { Dataset } from '../../../model/Dataset';

const ZodDataset = z.object({
	labelLg1: z
		.string({ required_error: D.mandatoryProperty(D1.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D1.title) }),
	labelLg2: z
		.string({ required_error: D.mandatoryProperty(D2.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D2.title) }),
	altIdentifier: z
		.string()
		.regex(/^[a-zA-Z0-9-_]+$/, { message: D.altIdError })
		.or(z.string().trim().length(0))
		.optional(),
	creator: z
		.string({ required_error: D.mandatoryProperty(D1.creatorTitle) })
		.min(1, { message: D.mandatoryProperty(D1.creatorTitle) }),
	contributor: z
		.string({ required_error: D.mandatoryProperty(D1.contributorTitle) })
		.array()
		.nonempty({ message: D.mandatoryProperty(D1.contributorTitle) }),
	disseminationStatus: z
		.string({
			required_error: D.mandatoryProperty(D1.disseminationStatusTitle),
		})
		.min(1, { message: D.mandatoryProperty(D1.disseminationStatusTitle) }),
	wasGeneratedIRIs: z
		.string({ required_error: D.mandatoryProperty(D1.generatedBy) })
		.array()
		.nonempty({ message: D.mandatoryProperty(D1.generatedBy) }),
});

export const validate = ({ catalogRecord, ...otherFields }: Dataset) =>
	formatValidation(ZodDataset)({
		creator: catalogRecord?.creator,
		contributor: catalogRecord?.contributor,
		...otherFields,
	});
