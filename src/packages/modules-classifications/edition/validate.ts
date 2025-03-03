import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import { D1, D2 } from '../../deprecated-locales';

const ZodFamily = z.object({
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
	additionalMaterial: z.string().url().optional(),
	legalMaterial: z.string().url().optional(),
	homepage: z.string().url().optional(),
});

export const validate = formatValidation(ZodFamily);
