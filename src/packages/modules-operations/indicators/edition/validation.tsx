import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyMultiSelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

const Serie = z.object({
	id: z.string(),
	type: z.string(),
});

const ZodIndicator = z.object({
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
	creators: mandatoryAndNotEmptyMultiSelectField(D.creatorsTitle),
	wasGeneratedBy: z.array(Serie).nonempty({
		message: D.mandatoryProperty(D.generatedBy),
	}),
});

export const validate = formatValidation(ZodIndicator);
