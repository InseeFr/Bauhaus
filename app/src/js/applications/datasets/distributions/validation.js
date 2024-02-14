import D, { D1, D2 } from '../../../i18n/build-dictionary';
// import { formatValidation } from 'js/utils/validation';
// import { z } from 'zod';

// const Distribution = z.object({
//     idDataset: z.string({
//         required_error: D.mandatoryProperty(D1.datasetsTitle)
//     }).min(1, {
//         message: D.mandatoryProperty(D1.datasetsTitle)
//     }),
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

// export const validate = formatValidation(Distribution);

export function validate({ idDataset, labelLg1, labelLg2 }) {
	const errorMessages = [];
	if (!idDataset) {
		errorMessages.push(D.mandatoryProperty(D1.datasetsTitle));
	}
	if (!labelLg1) {
		errorMessages.push(D.mandatoryProperty(D1.title));
	}
	if (!labelLg2) {
		errorMessages.push(D.mandatoryProperty(D2.title));
	}
	return {
		fields: {
			labelLg1: !labelLg1 ? D.mandatoryProperty(D1.title) : '',
			labelLg2: !labelLg2 ? D.mandatoryProperty(D2.title) : '',
			idDataset: !idDataset ? D.mandatoryProperty(D1.datasetsTitle) : '',
		},
		errorMessage: errorMessages,
	};
};
