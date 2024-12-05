import { z, ZodObject } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyMultiSelectField,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

let ZodSerie: ZodObject<any> = z.object({
	family: z.object(
		{
			id: z
				.string({ required_error: D.mandatoryProperty(D.familyTitle) })
				.trim()
				.min(1, { message: D.mandatoryProperty(D.familyTitle) }),
		},
		{
			required_error: D.mandatoryProperty(D.familyTitle),
		},
	),
	prefLabelLg1: mandatoryAndNotEmptyTextField(D1.title),
	prefLabelLg2: mandatoryAndNotEmptyTextField(D2.title),
	creators: mandatoryAndNotEmptyMultiSelectField(D.creatorsTitle),
});

export const listOfExtraMandatoryFields = (
	import.meta.env.VITE_VALIDATION_OPERATION_SERIES_EXTRA_MANDATORY_FIELDS ?? ''
).split(',');

export const isMandatoryField = (fieldName: string) =>
	listOfExtraMandatoryFields.indexOf(fieldName) >= 0;

const fieldToTitleMapping: Record<string, string> = {
	typeCode: D.operationType,
	accrualPeriodicityCode: D.dataCollectFrequency,
};

listOfExtraMandatoryFields.forEach((extraMandatoryField) => {
	ZodSerie = ZodSerie.setKey(
		extraMandatoryField,
		mandatoryAndNotEmptySelectField(
			fieldToTitleMapping[extraMandatoryField] ?? '',
		),
	);
});

export const validate = formatValidation(ZodSerie);
