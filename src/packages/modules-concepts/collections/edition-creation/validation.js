import D, { D1 } from '../../../deprecated-locales';
import { arrayKeepUniqueField } from '../../../utils/array-utils';
import { z } from 'zod';
import { formatValidation } from '../../../utils/validation';

const Collection = (collectionList, initialId, initialPrefLabelLg1) =>
	z.object({
		id: z
			.string({ required_error: D.mandatoryProperty(D.idTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D.idTitle) })
			.refine(
				(value) =>
					value === initialId ||
					!arrayKeepUniqueField(collectionList, 'id').includes(
						value
							.toLowerCase()
							.normalize('NFD')
							.replace(/\p{Diacritic}/gu, '')
					),
				{ message: D.duplicatedId }
			),
		prefLabelLg1: z
			.string({ required_error: D.mandatoryProperty(D1.labelTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D1.labelTitle) })
			.refine(
				(value) =>
					value === initialPrefLabelLg1 ||
					!arrayKeepUniqueField(collectionList, 'label').includes(
						value
							.toLowerCase()
							.normalize('NFD')
							.replace(/\p{Diacritic}/gu, '')
					),
				{ message: D.duplicatedLabel }
			),
		creator: z
			.string({ required_error: D.mandatoryProperty(D.creatorTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D.creatorTitle) }),
	});

export const validate = (
	general,
	collectionList,
	initialId,
	initialPrefLabelLg1
) =>
	formatValidation(Collection(collectionList, initialId, initialPrefLabelLg1))(
		general
	);
