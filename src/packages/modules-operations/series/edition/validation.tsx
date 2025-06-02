import { z, ZodObject } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyMultiSelectField,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';
import NewDictionary from '../../../i18n';

let ZodSerie: ZodObject<any> = z.object({
	family: z.object(
		{
			id: z
				.string({
					required_error: NewDictionary.errors.mandatoryProperty(D.familyTitle),
				})
				.trim()
				.min(1, {
					message: NewDictionary.errors.mandatoryProperty(D.familyTitle),
				}),
		},
		{
			required_error: NewDictionary.errors.mandatoryProperty(D.familyTitle),
		},
	),
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
	creators: mandatoryAndNotEmptyMultiSelectField(D.creatorsTitle),
});

const fieldToTitleMapping: Record<string, string> = {
	typeCode: D.operationType,
	accrualPeriodicityCode: D.dataCollectFrequency,
};

export const validate = (extraMandatoryFields: string[]) => {
	extraMandatoryFields.forEach((extraMandatoryField) => {
		ZodSerie = ZodSerie.setKey(
			extraMandatoryField,
			mandatoryAndNotEmptySelectField(
				fieldToTitleMapping[extraMandatoryField] ?? '',
			),
		);
	});

	return formatValidation(ZodSerie);
};
