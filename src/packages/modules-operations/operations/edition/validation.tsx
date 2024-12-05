import { z } from 'zod';

import { formatValidation } from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

const Operation = z.object({
	series: z.object(
		{
			id: z
				.string({ required_error: D.mandatoryProperty(D1.seriesTitle) })
				.trim()
				.min(1, { message: D.mandatoryProperty(D1.seriesTitle) }),
		},
		{
			required_error: D.mandatoryProperty(D1.seriesTitle),
		},
	),
	prefLabelLg1: z
		.string({ required_error: D.mandatoryProperty(D1.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D1.title) }),
	prefLabelLg2: z
		.string({ required_error: D.mandatoryProperty(D2.title) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D2.title) }),
	year: z.coerce
		.number({ message: D.numberProperty(D1.year) })
		.int({ message: D.numberProperty(D1.year) })
		.optional(),
});

export const validate = formatValidation(Operation);
