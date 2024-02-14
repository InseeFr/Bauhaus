import D, { D1, D2 } from '../../../i18n/build-dictionary';
// import { formatValidation } from 'js/utils/validation';
// import { z } from 'zod';

// const Dataset = z.object({
// 	labelLg1: z.string({
//         required_error: D.mandatoryProperty(D1.title)
//     }).min(1, {
//         message: D.mandatoryProperty(D1.title)
//     }),
// 	labelLg2: z.string({
//         required_error: D.mandatoryProperty(D2.title)
//     }).min(1, {
//         message: D.mandatoryProperty(D2.title)
//     }),
// });

// export const validate = formatValidation(Dataset);

export function validate({
	catalogRecord,
	disseminationStatus,
	labelLg1,
	labelLg2,
	idSerie,
}) {
	const errorMessages = [];
	const { creator, contributor } = catalogRecord ?? {};
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
			creator: !creator ? D.mandatoryProperty(D1.creatorTitle) : '',
			contributor: !contributor ? D.mandatoryProperty(D1.contributorTitle) : '',
			disseminationStatus: !disseminationStatus
				? D.mandatoryProperty(D1.disseminationStatusTitle)
				: '',
			idSerie: !idSerie ? D.mandatoryProperty(D1.generatedBy) : '',
		},
		errorMessage: errorMessages,
	};
};
