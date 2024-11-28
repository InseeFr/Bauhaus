import { z } from 'zod';

import { formatValidation } from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

let Serie = z.object({
	family: z.object(
		{
			id: z
				.string({ required_error: D.mandatoryProperty(D1.familyTitle) })
				.trim()
				.min(1, { message: D.mandatoryProperty(D1.familyTitle) }),
		},
		{
			required_error: D.mandatoryProperty(D1.familyTitle),
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
	creators: z
		.string({
			required_error: D.mandatoryProperty(D.creatorTitle),
		})
		.array()
		.nonempty({
			message: D.mandatoryProperty(D.creatorTitle),
		}),
});

export const listOfExtraMandatoryFields = (
	import.meta.env.VITE_VALIDATION_OPERATION_SERIES_EXTRA_MANDATORY_FIELDS ?? ''
).split(',');

export const isMandatoryField = (fieldName) =>
	listOfExtraMandatoryFields.indexOf(fieldName) >= 0;

const fieldToTitleMapping = {
	typeCode: D1.operationType,
	accrualPeriodicityCode: D1.dataCollectFrequency,
};

listOfExtraMandatoryFields.forEach((extraMandatoryField) => {
	Serie = Serie.setKey(
		extraMandatoryField,
		z
			.string({
				required_error: D.mandatoryProperty(
					fieldToTitleMapping[extraMandatoryField] ?? '',
				),
			})
			.min(1, {
				message: D.mandatoryProperty(
					fieldToTitleMapping[extraMandatoryField] ?? '',
				),
			}),
	);
});

export const validate = formatValidation(Serie);
