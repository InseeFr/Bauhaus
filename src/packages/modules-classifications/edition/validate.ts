import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import { D1, D2 } from '../../deprecated-locales';

const ZodClassification = z.object({
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
	additionalMaterial: z.url().optional(),
	legalMaterial: z.url().optional(),
	homepage: z.url().optional(),
});

export const validate = formatValidation(ZodClassification);
