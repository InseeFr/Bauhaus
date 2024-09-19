export const takeKeys = (keys: string[]) => (obj: Record<string, unknown>) =>
	keys.reduce((extract, key) => {
		extract[key] = obj[key] !== null ? obj[key] : '';
		return extract;
	}, {});
