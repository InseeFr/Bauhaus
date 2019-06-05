import D from 'js/i18n';

export function validate(document) {
	let errorMessage = '';
	if (!document.labelLg1 || !document.labelLg2)
		errorMessage = D.requiredPrefLabel;
	if (!document.url) errorMessage = D.requiredUrl; //TODO only for the likn
	if (!document.lang) errorMessage = D.requiredLang;
	return {
		fields: {
			prefLabelLg1: !document.labelLg1,
			prefLabelLg2: !document.labelLg2,
			url: !document.url, //TODO seulement pour les liens
			lang: !document.lang,
		},
		errorMessage,
	};
}
