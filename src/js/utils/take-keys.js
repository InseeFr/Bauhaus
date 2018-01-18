/**
 * Returns a function to extract the given keys from an object
 */
export default keys => obj =>
	keys.reduce((extract, key) => {
		extract[key] = obj[key] !== null ? obj[key] : "";
		return extract;
	}, {});
