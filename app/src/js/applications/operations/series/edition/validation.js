import D, { D1, D2 } from 'js/i18n';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

const listOfExtraMandatoryFields = (process.env.REACT_APP_VALIDATION_OPERATION_SERIES_EXTRA_MANDATORY_FIELDS ?? "").split(',');
export const isMandatoryField = fieldName => listOfExtraMandatoryFields.indexOf(fieldName) >= 0;

const Serie = z.object({
	prefLabelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	prefLabelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
	creators: z.string({
		required_error: D.mandatoryProperty(D.creatorTitle)
	}).array().nonempty({
		message: D.mandatoryProperty(D.creatorTitle)
	}),
	typeCode: z.string({
		required_error: D.mandatoryProperty(D1.operationType)
	}).min(1, {
		message: D.mandatoryProperty(D1.operationType)
	}),
	accrualPeriodicityCode: z.string({
		required_error: D.mandatoryProperty(D1.dataCollectFrequency)
	}).min(1, {
		message: D.mandatoryProperty(D1.dataCollectFrequency)
	}),
	family: z.object({
		id: z.string(),
	}, {
		required_error: D.mandatoryProperty(D1.familyTitle)
	}),
});

export const validate = formatValidation(Serie)
