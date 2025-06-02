import { z } from 'zod';

import { ItemGeneral } from '@model/Classification';

import {
	formatValidation,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import { D1, D2 } from '../../../deprecated-locales';

const ZodItem = (altLabelsLength: number) =>
	z.object({
		prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
		prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
		altLabelsLg1_: z
			.string()
			.max(altLabelsLength, {
				message: D1.classificationItemAltError(altLabelsLength),
			})
			.optional(),
		altLabelsLg2_: z
			.string()
			.max(altLabelsLength, {
				message: D2.classificationItemAltError(altLabelsLength),
			})
			.optional(),
	});

export const validate = (item: ItemGeneral, altLabelsLength: string) =>
	formatValidation(ZodItem(Number(altLabelsLength)))(item);
