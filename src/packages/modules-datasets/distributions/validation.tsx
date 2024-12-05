import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../deprecated-locales/build-dictionary';

const ZodDistribution = z.object({
	idDataset: mandatoryAndNotEmptySelectField(D.datasetTitle),
	labelLg1: mandatoryAndNotEmptyTextField(D1.title),
	labelLg2: mandatoryAndNotEmptyTextField(D2.title),
});

export const validate = formatValidation(ZodDistribution);
