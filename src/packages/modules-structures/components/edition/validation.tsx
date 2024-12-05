import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';

const ZodComponent = z.object({
	identifiant: mandatoryAndNotEmptyTextField(D.idTitle),
	labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
	labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
	type: mandatoryAndNotEmptySelectField(D.type),
});

export const validate = formatValidation(ZodComponent);
