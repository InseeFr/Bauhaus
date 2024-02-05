import D, { D1, D2 } from 'js/i18n';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

const Operation = z.object({
	prefLabelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	prefLabelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
	serie: z.null(), // pas encore trouvé comment vérifier la présence ou non de "séries"
});

export const validate = formatValidation(Operation)
