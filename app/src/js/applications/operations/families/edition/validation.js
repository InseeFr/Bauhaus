import D, { D1, D2 } from 'js/i18n';
import { z } from 'zod';

const formatValidation = (ZodObject) => (values) => {
	const ZodError = ZodObject.safeParse(values);
	const defaultFields = Object.keys(Family.shape).reduce(
		(acc, key) => ({
			...acc,
			[key]: '',
		}),
		{}
	);

	if (ZodError.success) {
		return {
			errorMessage: [],
			fields: defaultFields,
		};
	}

	const fields = {
		...defaultFields,
		...ZodError.error.issues.reduce((acc, error) => {
			return {
				...acc,
				[error.path]: error.message,
			};
		}, {}),
	};

	const errorMessages = ZodError.error.issues.map((error) => error.message);
	return {
		fields,
		errorMessage: errorMessages,
	};
};

const Family = z.object({
	prefLabelLg1: z.string({
		required_error: D.mandatoryProperty(D1.title),
	}),
	prefLabelLg2: z.string({
		required_error: D.mandatoryProperty(D2.title),
	}),
});

export function validate(family) {
	return formatValidation(Family)(family);
}
