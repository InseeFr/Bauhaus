import D, { D1, D2 } from '../../../../i18n';
import { formatValidation } from '../../../../utils/validation';
import { z } from 'zod';

const Operation = z.object({
	prefLabelLg1: z.string().min(1, { message: D.mandatoryProperty(D1.title) }),
	prefLabelLg2: z.string().min(1, { message: D.mandatoryProperty(D2.title) }),
	series: z.object(
		{
			id: z.string(),
		},
		{
			required_error: D.mandatoryProperty(D1.seriesTitle),
		}
	),
});

export const validate = formatValidation(Operation);
