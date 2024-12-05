import { z } from 'zod';

import { arrayKeepUniqueField } from '@utils/array-utils';
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

const deburr = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');

const ZodCollection = (
	collectionList: CollectionsList,
	initialId: string,
	initialPrefLabelLg1: string,
) =>
	z.object({
		id: mandatoryAndNotEmptyTextField(D.idTitle).refine(
			(value) =>
				value === initialId ||
				!arrayKeepUniqueField(collectionList, 'id').includes(deburr(value)),
			{ message: D.duplicatedId },
		),
		prefLabelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle).refine(
			(value) =>
				value === initialPrefLabelLg1 ||
				!arrayKeepUniqueField(collectionList, 'label').includes(deburr(value)),
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
