import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import { D1, D2 } from '../../../deprecated-locales';

const ZodItem = z.object({
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
	altLabelsLg1_: z
		.string()
		.max(length, { message: D1.classificationItemAltError(length) })
		.optional(),
	altLabelsLg2_: z
		.string()
		.max(length, { message: D2.classificationItemAltError(length) })
		.optional(),
});

export const validate = formatValidation(ZodItem);
