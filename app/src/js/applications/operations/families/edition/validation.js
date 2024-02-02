import D, { D1, D2 } from 'js/i18n';
import { z } from 'zod';

const formatValidation = (ZodObject) => (values) => {
	const ZodError = ZodObject.safeParse(values);

	const defaultFields = Object.keys(ZodObject.shape).reduce(
		(acc, key) => ({
			...acc,
			[key]: '',
		}),
		{}
	);

	if (ZodError.success) {
		return {
			fields: defaultFields,
			errorMessage: [],
		};
	}

	const fields = {
		...defaultFields,
		...ZodError.error.issues.reduce(
		(acc, error) => ({
			...acc,
			[error.path]: error.message,
		}),
		{}
	)};

	const errorMessage = ZodError.error.issues.map((error) => error.message);

	return {
		fields,
		errorMessage,
	};
};

const Family = z.object({
	prefLabelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	prefLabelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
});

export const validate = formatValidation(Family)
