import { z, ZodObject } from 'zod';

import D from '../deprecated-locales';

export const formatValidation =
	(zodObject: ZodObject<any>) => (values: any) => {
		const ZodError = zodObject.safeParse(values);

		const defaultFields = Object.keys(zodObject.shape).reduce(
			(acc, key) => ({
				...acc,
				[key]: '',
			}),
			{},
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
					[error.path[0]]: error.message,
				}),
				{},
			),
		};

		const errorMessage = ZodError.error.issues.map((error) => error.message);

		return {
			fields,
			errorMessage,
		};
	};

export const mandatoryAndNotEmptyTextField = (property: string) => {
	return z
		.string({ required_error: D.mandatoryProperty(property) })
		.trim()
		.min(1, { message: D.mandatoryProperty(property) });
};

export const mandatoryAndNotEmptySelectField = (property: string) => {
	return z
		.string({ required_error: D.mandatoryProperty(property) })
		.min(1, { message: D.mandatoryProperty(property) });
};

export const mandatoryAndNotEmptyMultiSelectField = (property: string) => {
	return z
		.string({ required_error: D.mandatoryProperty(property) })
		.array()
		.nonempty({
			message: D.mandatoryProperty(property),
		});
};
