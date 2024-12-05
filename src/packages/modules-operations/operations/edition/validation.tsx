import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

const ZodOperation = z.object({
	series: z.object(
		{
			id: z
				.string({ required_error: D.mandatoryProperty(D.serieTitle) })
				.trim()
				.min(1, { message: D.mandatoryProperty(D.serieTitle) }),
		},
		{
			required_error: D.mandatoryProperty(D.serieTitle),
		},
	),
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
});

export const validate = formatValidation(ZodOperation);
