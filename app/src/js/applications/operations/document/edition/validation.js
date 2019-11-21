import D from 'js/i18n';
import { LINK, DOCUMENT } from '../utils';

/* eslint-disable no-useless-escape */

/**
 * Check if the name of every file is invalid
 *
 * @param {Array<{name}>} files
 * @returns {boolean}
 */
function haveInvalidFilesName(files = []) {
	const regexp = /^[a-zA-Z0-9-_\.]*$/;

	const wrongFile = files
		.map(file => file.name)
		.map(name => name.substr(name.lastIndexOf('/') + 1, name.length))
		.find(fileName => !regexp.test(fileName));

	return wrongFile;
}

/**
 * Check the files array has at least one element
 *
 * @param {Array<{name}>} files
 * @returns {boolean}
 */
function haveFiles(files = []) {
	return files.length > 0;
}

/**
 * Check if the document or link we want to add is valid.
 *
 * @param {any} document the content of the form
 * @param {string} type the type of document
 * @param {{name: string}[]=} files the files we want to upload
 * @returns {{fields: any, errorMessage: string}}
 */
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
	} else if (type === DOCUMENT && !document.updatedDate) {
		errorMessage = D.requiredUpdatedDate;
		fields.updatedDate = true;
	} else if (type === DOCUMENT && !haveFiles(files)) {
		return {
			errorMessage: D.requiredFile,
			fields: { file: true },
		};
	} else if (type === DOCUMENT && haveInvalidFilesName(files)) {
		return {
			errorMessage: D.wrongFileName,
			fields: { file: true },
		};
	} else if (!document.lang) {
		errorMessage = D.requiredLang;
		fields.lang = true;
	}
	return {
		fields,
		errorMessage,
	};
}
