export default str =>
	str ? (/^http(s?):\/\//.test(str) ? str : `http://${str}`) : '';
