import D from '../../../deprecated-locales';
import { arrayKeepUniqueField } from '../../../utils/array-utils';
import { z } from 'zod';
import { formatValidation } from '../../../utils/validation';

const Collection = (collectionList, initialId, initialPrefLabelLg1) =>
	z.object({
		id: z
			.string({ required_error: D.incompleteCollection })
			.trim()
			.min(1, { message: D.incompleteCollection })
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
			.string({ required_error: D.incompleteCollection })
			.trim()
			.min(1, { message: D.incompleteCollection })
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
			.string({ required_error: D.incompleteCollection })
			.trim()
			.min(1, { message: D.incompleteCollection }),
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
