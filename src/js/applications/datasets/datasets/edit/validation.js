import D, { D1, D2 } from '../../../../i18n';
import { z } from 'zod';
import { formatValidation } from '../../../../new-architecture/utils/validation';

const Dataset = z.object({
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
		.or(z.literal(''))
		.optional(),
	creator: z
		.string({ required_error: D.mandatoryProperty(D1.creatorTitle) })
		.min(1, { message: D.mandatoryProperty(D1.creatorTitle) }),
	contributor: z
		.string({
			required_error: D.mandatoryProperty(D1.contributorTitle),
		})
		.array()
		.nonempty({
			message: D.mandatoryProperty(D1.contributorTitle),
		}),
	disseminationStatus: z
		.string({
			required_error: D.mandatoryProperty(D1.disseminationStatusTitle),
		})
		.min(1, { message: D.mandatoryProperty(D1.disseminationStatusTitle) }),
	idSerie: z
		.string({ required_error: D.mandatoryProperty(D1.generatedBy) })
		.min(1, { message: D.mandatoryProperty(D1.generatedBy) }),
});

export const validate = ({ catalogRecord, ...otherFields }) =>
	formatValidation(Dataset)({
		creator: catalogRecord?.creator,
		contributor: catalogRecord?.contributor,
		...otherFields,
	});
