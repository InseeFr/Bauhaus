import D, { D1, D2 } from 'js/i18n';

export function validate({ prefLabelLg1, prefLabelLg2, series }) {
	const errorMessages = [];
	if(!prefLabelLg1){
		errorMessages.push(D.mandatoryProperty(D1.title))
	}
	if(!prefLabelLg2){
		errorMessages.push(D.mandatoryProperty(D2.title))
	}

	if (!series) {
		errorMessages.push(D.mandatoryProperty(D1.seriesTitle));
	}
	return {
		fields: {
			prefLabelLg1: !prefLabelLg1 ? D.mandatoryProperty(D1.title) : '',
			prefLabelLg2: !prefLabelLg2 ? D.mandatoryProperty(D2.title) : '',
			series: !series ? D.mandatoryProperty(D1.seriesTitle) : '',
		},
		errorMessage: errorMessages,
	};
}
