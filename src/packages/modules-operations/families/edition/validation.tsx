import { z } from 'zod';

import { formatValidation } from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

const ZodFamily = z.object({
	prefLabelLg1: z
		.string({ required_error: D.mandatoryProperty(D1.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D1.title) }),
	prefLabelLg2: z
		.string({ required_error: D.mandatoryProperty(D2.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D2.title) }),
});

export const validate = formatValidation(ZodFamily);
