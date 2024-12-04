import { z } from 'zod';

import { formatValidation } from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

const GeneratedBy = z.object({
	id: z
		.string({ required_error: D.mandatoryProperty(D.generatedBy) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D.generatedBy) }),
	type: z.string().refine((value) => value === 'series', {
		message: D.notASerie,
	}),
});

const ZodIndicator = z.object({
	prefLabelLg1: z
		.string({ required_error: D.mandatoryProperty(D1.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D1.title) }),
	prefLabelLg2: z
		.string({ required_error: D.mandatoryProperty(D2.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D2.title) }),
	creators: z
		.string({
			required_error: D.mandatoryProperty(D.creatorTitle),
		})
		.array()
		.nonempty({
			message: D.mandatoryProperty(D.creatorTitle),
		}),
	wasGeneratedBy: z.array(GeneratedBy).nonempty({
		message: D.mandatoryProperty(D.generatedBy),
	}),
});

export const validate = formatValidation(ZodIndicator);
