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
		.max(65, { message: D1.classificationItemAltError(65) })
		.optional(),
	altLabelsLg2_: z
		.string()
		.max(65, { message: D2.classificationItemAltError(65) })
		.optional(),
});

export const validate = formatValidation(ZodItem);
