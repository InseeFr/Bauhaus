import { z } from 'zod';

import D, { D1, D2 } from '../../deprecated-locales';
import { formatValidation } from '../../utils/validation';

export const generateMandatoryAndNotEmptyField = (property: string) => {
	return z
		.string({ required_error: D.mandatoryProperty(property) })
		.trim()
		.min(1, { message: D.mandatoryProperty(property) });
};

export const StructureZod = z.object({
	identifiant: generateMandatoryAndNotEmptyField(D.idTitle),
	labelLg1: generateMandatoryAndNotEmptyField(D1.labelTitle),
	labelLg2: generateMandatoryAndNotEmptyField(D2.labelTitle),
});

export const validate = formatValidation(StructureZod);
