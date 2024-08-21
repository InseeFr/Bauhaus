import D from '../../../deprecated-locales';
import { arrayKeepUniqueField } from '../../../utils/array-utils';

export const validate = (
	{ id, prefLabelLg1, creator },
	collectionList,
	initialId,
	initialPrefLabelLg1
) => {
	if (
		id !== initialId &&
		arrayKeepUniqueField(collectionList, 'id').includes(
			id
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
		)
	) {
		return D.duplicatedId;
	}

	if (
		prefLabelLg1 !== initialPrefLabelLg1 &&
		arrayKeepUniqueField(collectionList, 'label').includes(
			prefLabelLg1
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
		)
	) {
		return D.duplicatedLabel;
	}

	if (!id || !prefLabelLg1 || !creator) {
		return D.incompleteCollection;
	}
};
