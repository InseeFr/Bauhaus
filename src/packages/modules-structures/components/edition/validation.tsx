import D from '../../../deprecated-locales';
import { z } from 'zod';
import { formatValidation } from '@utils/validation';
import { StructureZod } from '../../edition/validation';

const ComponentZod = StructureZod.extend({
	type: z
		.string({ required_error: D.mandatoryProperty(D.type) })
		.min(1, { message: D.mandatoryProperty(D.type) }),
});

export const validate = formatValidation(ComponentZod);
