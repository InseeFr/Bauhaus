import D, {D1, D2} from 'js/i18n';
import { z } from "zod"

const mySchema = z.coerce.boolean()

export function validate({ prefLabelLg1, prefLabelLg2 }) {
	const fields = {}
	const errorMessages = [];

	if(!mySchema.parse(prefLabelLg1)){
		errorMessages.push(D.mandatoryProperty(D1.title))
		fields.prefLabelLg1 = D.mandatoryProperty(D1.title)
	}
	if(!mySchema.parse(prefLabelLg2)){
		errorMessages.push(D.mandatoryProperty(D2.title))
		fields.prefLabelLg2 = D.mandatoryProperty(D2.title)
	}
	return {
		fields,
		errorMessage: errorMessages
	};
}
