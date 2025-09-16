import { z, ZodObject } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptyMultiSelectField,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';
import NewDictionary from '../../../i18n';

const ZodSerie: ZodObject<any> = z.object({
	family: z.object(
		{
			id: z
				.string({
					error: (issue) =>
						issue.input === undefined &&
						NewDictionary.errors.mandatoryProperty(D.familyTitle),
				})
				.trim()
				.min(1, {
					error: NewDictionary.errors.mandatoryProperty(D.familyTitle),
				}),
		},
		{
			error: (issue) =>
				issue.input === undefined &&
				NewDictionary.errors.mandatoryProperty(D.familyTitle),
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

const addFieldsToObject = (
	listOfFields: string[],
	baseObject: ZodObject<any>,
) => {
	const shapeFromFields = Object.fromEntries(
		listOfFields.map((field) => [
			field,
			mandatoryAndNotEmptySelectField(fieldToTitleMapping[field] ?? ''),
		]),
	);
	return z.object({
		...baseObject.shape,
		...shapeFromFields,
	});
};

export const validate = (extraMandatoryFields: string[]) => {
	if (!extraMandatoryFields) return formatValidation(ZodSerie);

	const ZodEnhancedSerie = addFieldsToObject(extraMandatoryFields, ZodSerie);
	return formatValidation(ZodEnhancedSerie);
};
