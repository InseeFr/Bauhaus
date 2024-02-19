import D, { D1, D2 } from 'js/i18n';

export const validate = ({ identifiant, labelLg1, labelLg2 }) => {
	const errorMessage = [];
	if (!identifiant) {
		errorMessage.push(D.mandatoryProperty(D.idTitle));
	}
	if (!labelLg1) {
		errorMessage.push(D.mandatoryProperty(D1.labelTitle));
	}
	if (!labelLg2) {
		errorMessage.push(D.mandatoryProperty(D2.labelTitle));
	}
	return {
		errorMessage, fields: {
			identifiant: !identifiant ? D.mandatoryProperty(D.idTitle) : '',
			labelLg1: !labelLg1 ? D.mandatoryProperty(D1.labelTitle) : '',
			labelLg2: !labelLg2 ? D.mandatoryProperty(D2.labelTitle) : '',
		},
	};
};
