import { ZodObject } from 'zod';

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
