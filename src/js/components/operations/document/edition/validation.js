import D from 'js/i18n';
import { LINK, DOCUMENT } from '../utils';

/**
 * Check if a list of document is correct.
 * This list of document should respect the following criterias
 * - Should have at least one item
 * - The name of each files should respect a regexp
 *
 * @param {Array<{name}>} files
 * @returns {{errorMessage: string, fields: { file:  boolean}}}
 */
function verifyFile(files = []) {
	const regexp = /^[a-zA-Z1-9-_\.]*$/;
	let errorMessage = '';

	if (files.length === 0) {
		errorMessage = D.requiredFile;
	} else {
		const wrongFile = files
			.map(file => file.name)
			.find(fileName => !regexp.test(fileName));
		if (wrongFile) {
			errorMessage = D.wrongFileName;
		}
	}
	return {
		errorMessage,
		fields: { file: errorMessage !== '' },
	};
}

export function validate(document, type, files) {
	const fields = {};
	let errorMessage = '';
	if (!document.labelLg1 || !document.labelLg2) {
		errorMessage = D.requiredPrefLabel;
		fields.prefLabelLg1 = !document.labelLg1;
		fields.prefLabelLg2 = !document.labelLg2;
	} else if (type === LINK && !document.url) {
		errorMessage = D.requiredUrl;
		fields.url = true;
	} else if (type === LINK && !/https*\:\/\//.test(document.url)) {
		errorMessage = D.badUrl;
		fields.url = true;
	} else if (!document.lang) {
		errorMessage = D.requiredLang;
		fields.lang = true;
	} else if (type === DOCUMENT) {
		return verifyFile(files);
	}
	return {
		fields,
		errorMessage,
	};
}
