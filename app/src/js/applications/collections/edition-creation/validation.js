import D from 'js/i18n';
import deburr from 'lodash/deburr';
import { ArrayUtils } from 'bauhaus-utilities';
// import { formatValidation } from 'js/utils/validation';
// import { z } from 'zod';

// const General = z.object({});

// export const validate = formatValidation(General);

export const validate = (
	{ id, prefLabelLg1, creator },
	collectionList,
	initialId,
	initialPrefLabelLg1
) => {
	let message = '';

	if (!id || !prefLabelLg1 || !creator) {
		message = D.incompleteCollection;
	}

	if (
		id !== initialId &&
		ArrayUtils.arrayKeepUniqueField(collectionList, 'id').indexOf(
			id
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
		) !== -1
	) {
		message = D.duplicatedId;
	}

	if (
		prefLabelLg1 !== initialPrefLabelLg1 &&
		ArrayUtils.arrayKeepUniqueField(collectionList, 'label').indexOf(
			deburr(prefLabelLg1.toLowerCase())
		) !== -1
	) {
		message = D.duplicatedLabel;
	}

	return message;
};
