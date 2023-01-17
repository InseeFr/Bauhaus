import D, { D1, D2 } from 'js/i18n';
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

function checkUrl (url) {
	let givenURL
	try {
		givenURL = new URL (url);
	} catch (error) {
		return false;
	}
	return givenURL.protocol === "http:" || givenURL.protocol === "https:";
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
	let errorMessages = [];

	if(!document.labelLg1){
		errorMessages.push(D.mandatoryProperty(D1.title));
		fields.prefLabelLg1 = true;
	}

	if(!document.labelLg2){
		errorMessages.push(D.mandatoryProperty(D2.title));
		fields.prefLabelLg2 = true;
	}

	if (type === LINK && !document.url) {
		errorMessages.push(D.mandatoryProperty(D.titleLink));
		fields.url = true;
	}

	if (type === LINK && !checkUrl(document.url)) {
		errorMessages.push(D.badUrl);
		fields.url = true;
	}

	if (type === DOCUMENT && !document.updatedDate) {
		errorMessages.push(D.requiredUpdatedDate);
		fields.updatedDate = true;
	}

	if (type === DOCUMENT && !haveFiles(files)) {
		errorMessages.push(D.requiredFile);
		fields.file = true;
	}

	if (type === DOCUMENT && haveInvalidFilesName(files)) {
		errorMessages.push(D.wrongFileName);
		fields.file = true;
	}

	if (!document.lang) {
		errorMessages.push(D.requiredLang);
		fields.lang = true;
	}

	return {
		fields,
		errorMessage: errorMessages,
	};
}
