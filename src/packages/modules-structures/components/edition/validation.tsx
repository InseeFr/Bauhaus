import { z } from 'zod';

import { formatValidation } from '@utils/validation';

import D from '../../../deprecated-locales';
import { ZodStructure } from '../../edition/validation';

const ZodComponent = ZodStructure.extend({
	type: z
		.string({ required_error: D.mandatoryProperty(D.type) })
		.min(1, { message: D.mandatoryProperty(D.type) }),
});

export const validate = formatValidation(ZodComponent);
