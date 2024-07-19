import D, { D1, D2 } from '../../../../i18n';
import { z } from 'zod';
import { formatValidation } from '../../../../new-architecture/utils/validation';

const Component = z.object({
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
	type: z
		.string({ required_error: D.mandatoryProperty(D.type) })
		.min(1, { message: D.mandatoryProperty(D.type) }),
});

export const validate = formatValidation(Component);
