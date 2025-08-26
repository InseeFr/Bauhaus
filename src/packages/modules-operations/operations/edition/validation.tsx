import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';
import NewDictionary from '../../../i18n';

const ZodOperation = z.object({
	series: z.object(
		{
			id: z
				.string({
					required_error: NewDictionary.errors.mandatoryProperty(D.serieTitle),
				})
				.trim()
				.min(1, {
					error: NewDictionary.errors.mandatoryProperty(D.serieTitle),
				}),
		},
		{
			required_error: NewDictionary.errors.mandatoryProperty(D.serieTitle),
		},
	),
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
	year: z.coerce
		.number({ error: D.numberProperty(D1.year) })
		.int({ error: D.numberProperty(D1.year) })
		.optional(),
});

export const validate = formatValidation(ZodOperation);
