/**
 * Create an empty object with a default value
 */
export default function objectFromKeys(keys: string[], defaultValue: string) {
	return keys.reduce((obj: Record<string, string>, key: string) => {
		obj[key] = defaultValue;
		return obj;
	}, {});
}
