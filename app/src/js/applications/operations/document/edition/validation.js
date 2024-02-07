import D, { D1, D2 } from 'js/i18n';
import { LINK, DOCUMENT } from '../utils';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

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

function checkUrl(url) {
	let givenURL
	try {
		givenURL = new URL (url);
	} catch (error) {
		return false;
	}
	return givenURL.protocol === "http:" || givenURL.protocol === "https:";
}

export function validate(document, type, files) {
	const fields = {};
	let errorMessages = [];

	if(!document.labelLg1){
		errorMessages.push(D.mandatoryProperty(D1.title));
		fields.labelLg1 = D.mandatoryProperty(D1.title);
	}

	if(!document.labelLg2){
		errorMessages.push(D.mandatoryProperty(D2.title));
		fields.labelLg2 = D.mandatoryProperty(D2.title);
	}

	if (type === LINK && !document.url) {
		errorMessages.push(D.mandatoryProperty(D.titleLink));
		fields.url = D.mandatoryProperty(D.titleLink);
	}

	if (type === LINK && !checkUrl(document.url)) {
		errorMessages.push(D.badUrl);
		fields.url = D.badUrl;
	}

	if (type === DOCUMENT && !document.updatedDate) {
		errorMessages.push(D.requiredUpdatedDate);
		fields.updatedDate = D.requiredUpdatedDate;
	}

	if (type === DOCUMENT && !haveFiles(files)) {
		errorMessages.push(D.requiredFile);
		fields.file = D.requiredFile;
	}

	if (type === DOCUMENT && haveInvalidFilesName(files)) {
		errorMessages.push(D.wrongFileName);
		fields.file = D.wrongFileName;
	}

	if (!document.lang) {
		errorMessages.push(D.requiredLang);
		fields.lang = D.requiredLang;
	}

	return {
		fields,
		errorMessages,
	};
}

const Link = z.object({
	prefLabelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	prefLabelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
	lang: z.string({
		required_error: D.requiredLang
	}).min(1, {
		message: D.requiredLang
	}),
});

const Document = z.object({
	prefLabelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	prefLabelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
	lang: z.string({
		required_error: D.requiredLang
	}).min(1, {
		message: D.requiredLang
	}),
});

export const validate2 = formatValidation(true ? Link : Document)
