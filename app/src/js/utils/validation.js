export const formatValidation = (ZodObject) => (values) => {
	const ZodError = ZodObject.safeParse(values);
	console.log(ZodError)

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
                [error.path]: error.message, // .substring(0, error.path.indexOf(','))
            }),
		    {}
        )
    };
	console.log(fields)

	const errorMessage = ZodError.error.issues.map((error) => error.message);

	return {
		fields,
		errorMessage,
	};
};
