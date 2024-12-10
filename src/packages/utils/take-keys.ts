export const takeKeys = (keys: string[]) => (obj: Record<string, unknown>) =>
	keys.reduce((extract, key) => {
		if (obj[key] !== null) {
			return {
				...extract,
				[key]: obj[key],
			};
		}

		return {
			...extract,
			[key]: '',
		};
	}, {});
