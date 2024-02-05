import D, { D1, D2 } from 'js/i18n';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

const Indicator = z.object({
	prefLabelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	prefLabelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
	creators: z.string().array().nonempty({message: D.mandatoryProperty(D.creatorTitle)}),
});

export const validate = formatValidation(Indicator)
