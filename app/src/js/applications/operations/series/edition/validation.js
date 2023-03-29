import D, { D1, D2 } from 'js/i18n';

export function validate({ creators, prefLabelLg1, prefLabelLg2, family }) {
	const errorMessages = [];

	if(!creators || creators.length === 0){
		errorMessages.push(D.mandatoryProperty(D1.creatorTitle))
	}

	if(!prefLabelLg1){
		errorMessages.push(D.mandatoryProperty(D1.title))
	}
	if(!prefLabelLg2){
		errorMessages.push(D.mandatoryProperty(D2.title))
	}

	if (!family) {
		errorMessages.push(D.mandatoryProperty(D1.familyTitle))
	}

	return {
		fields: {
			creators: (!creators || creators.length === 0) ? D.mandatoryProperty(D1.creatorTitle) : '',
			prefLabelLg1: !prefLabelLg1 ? D.mandatoryProperty(D1.title) : '',
			prefLabelLg2: !prefLabelLg2 ? D.mandatoryProperty(D2.title) : '',
			family: !family ? D.mandatoryProperty(D1.familyTitle) : '',
		},
		errorMessage: errorMessages,
	};
}
