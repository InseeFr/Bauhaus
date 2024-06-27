import D from 'js/i18n';
import { ArrayUtils } from 'js/utils';

export const validate = (
	{ id, prefLabelLg1, creator },
	collectionList,
	initialId,
	initialPrefLabelLg1
) => {
	if (
		id !== initialId &&
		ArrayUtils.arrayKeepUniqueField(collectionList, 'id').includes(
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
		ArrayUtils.arrayKeepUniqueField(collectionList, 'label').includes(
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
