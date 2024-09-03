import D, { D1, D2 } from '../../deprecated-locales';
import { z } from 'zod';
import { formatValidation } from '../../utils/validation';

export const StructureZod = z.object({
	identifiant: z
		.string({ required_error: D.mandatoryProperty(D.idTitle) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D.idTitle) }),
	labelLg1: z
		.string({ required_error: D.mandatoryProperty(D1.labelTitle) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D1.labelTitle) }),
	labelLg2: z
		.string({ required_error: D.mandatoryProperty(D2.labelTitle) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D2.labelTitle) }),
});

export const validate = formatValidation(StructureZod);
