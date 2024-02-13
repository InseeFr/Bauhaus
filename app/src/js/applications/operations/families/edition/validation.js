import D, { D1, D2 } from 'js/i18n';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

// export function validate({ prefLabelLg1, prefLabelLg2 }) {

// 	const errorMessages = [];
// 	if(!prefLabelLg1){
// 		errorMessages.push(D.mandatoryProperty(D1.title))
// 	}
// 	if(!prefLabelLg2){
// 		errorMessages.push(D.mandatoryProperty(D2.title))
// 	}
// 	return {
// 		fields: {
// 			prefLabelLg1: !prefLabelLg1 ? D.mandatoryProperty(D1.title) : '',
// 			prefLabelLg2: !prefLabelLg2 ? D.mandatoryProperty(D2.title) : '',
// 		},
// 		errorMessage: errorMessages
// 	};
// }

const Family = z.object({
	prefLabelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	prefLabelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
});

export const validate = formatValidation(Family)