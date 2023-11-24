import D, { D1, D2 } from '../../../i18n/build-dictionary';

export function validate({
	creator,
	contributor,
	disseminationStatus,
	labelLg1,
	labelLg2,
	idSerie,
}) {
	const errorMessages = [];
	if (!labelLg1) {
		errorMessages.push(D.mandatoryProperty(D1.title));
	}
	if (!labelLg2) {
		errorMessages.push(D.mandatoryProperty(D2.title));
	}
	if (!creator) {
		errorMessages.push(D.mandatoryProperty(D1.creatorTitle));
	}
	if (!contributor) {
		errorMessages.push(D.mandatoryProperty(D1.contributorTitle));
	}
	if (!disseminationStatus) {
		errorMessages.push(D.mandatoryProperty(D1.disseminationStatusTitle));
	}
	if (!idSerie) {
		errorMessages.push(D.mandatoryProperty(D1.generatedBy));
	}
	return {
		fields: {
			labelLg1: !labelLg1 ? D.mandatoryProperty(D1.title) : '',
			labelLg2: !labelLg2 ? D.mandatoryProperty(D2.title) : '',
			creator: !labelLg2 ? D.mandatoryProperty(D1.creatorTitle) : '',
			contributor: !contributor ? D.mandatoryProperty(D1.contributorTitle) : '',
			disseminationStatus: !disseminationStatus
				? D.mandatoryProperty(D1.disseminationStatusTitle)
				: '',
			idSerie: !idSerie ? D.mandatoryProperty(D1.generatedBy) : '',
		},
		errorMessage: errorMessages,
	};
}
