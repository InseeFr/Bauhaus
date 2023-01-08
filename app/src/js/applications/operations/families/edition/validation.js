import D, {D1, D2} from 'js/i18n';

export function validate({ prefLabelLg1, prefLabelLg2 }) {

	const errorMessages = [];
	if(!prefLabelLg1){
		errorMessages.push(D.mandatoryProperty(D1.title))
	}
	if(!prefLabelLg2){
		errorMessages.push(D.mandatoryProperty(D2.title))
	}
	return {
		fields: {
			prefLabelLg1: !prefLabelLg1,
			prefLabelLg2: !prefLabelLg2,
		},
		errorMessage: errorMessages
	};
}
