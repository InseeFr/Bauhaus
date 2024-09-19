/**
 * Create an empty object with a default value
 *
 * @export
 * @param {array} keys
 * @param {any} defaultValue
 * @returns {object}
 */
export default function objectFromKeys(keys, defaultValue) {
	return keys.reduce((obj, key) => {
		obj[key] = defaultValue;
		return obj;
	}, {});
}
