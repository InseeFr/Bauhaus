import D, { D1, D2 } from '../../../i18n/build-dictionary';
import { z } from 'zod';
import { formatValidation } from '../../../new-architecture/utils/validation';

const Distribution = z.object({
	labelLg1: z
		.string({ required_error: D.mandatoryProperty(D1.title) })
		.min(1, { message: D.mandatoryProperty(D1.title) }),
	labelLg2: z
		.string({ required_error: D.mandatoryProperty(D2.title) })
		.min(1, { message: D.mandatoryProperty(D2.title) }),
	idDataset: z.string({ required_error: D.mandatoryProperty(D1.datasetTitle) }),
});

export const validate = formatValidation(Distribution);
