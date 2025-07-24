import { z } from 'zod';

import { arrayKeepUniqueField } from '@utils/array-utils';
import { normalize } from '@utils/string-utils';
import {
	formatValidation,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1 } from '../../../deprecated-locales';
import { Collection } from '../../../model/concepts/collection';

type CollectionsList = {
	id: string;
	label: string;
}[];

const ZodCollection = (
	collectionList: CollectionsList,
	initialId: string,
	initialPrefLabelLg1: string,
) =>
	z.object({
		prefLabelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle).refine(
			(value) =>
				value === initialPrefLabelLg1 ||
				!arrayKeepUniqueField(collectionList, 'label').includes(
					normalize(value),
				),
			{ message: D.duplicatedLabel },
		),
		creator: mandatoryAndNotEmptySelectField(D.creatorTitle),
	});

export const validate = (
	general: Collection,
	collectionList: CollectionsList,
	initialId: string,
	initialPrefLabelLg1: string,
) =>
	formatValidation(
		ZodCollection(collectionList, initialId, initialPrefLabelLg1),
	)(general);
