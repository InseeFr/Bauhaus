import D, { D1, D2 } from '../../../i18n';
import { formatValidation } from '../../../utils/validation';
import { z } from 'zod';

const Structure = z.object({
	identifiant: z.string().min(1, { message: D.mandatoryProperty(D.idTitle) }),
	labelLg1: z.string().min(1, { message: D.mandatoryProperty(D1.labelTitle) }),
	labelLg2: z.string().min(1, { message: D.mandatoryProperty(D2.labelTitle) }),
});

export const validate = formatValidation(Structure);
