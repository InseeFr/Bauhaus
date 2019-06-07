import D from 'js/i18n';
import { LINK, DOCUMENT } from '../utils';

export function validate(document, type, files) {
	console.log(files);
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
	} else if (type === DOCUMENT && files.length === 0) {
		errorMessage = D.requiredFile;
		fields.file = true;
	} else if (!document.lang) {
		errorMessage = D.requiredLang;
		fields.lang = true;
	}
	return {
		fields,
		errorMessage,
	};
}
