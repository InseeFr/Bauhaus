import D, { D1 } from '../../../deprecated-locales';
import { arrayKeepUniqueField } from '@utils/array-utils';
import { z } from 'zod';
import { formatValidation } from '@utils/validation';
import { Collection } from '../../../model/concepts/collection';

type CollectionsList = {
	id: string;
	label: string;
}[];

const generateMandatoryAndNotEmptyField = (property: string) => {
	return z
		.string({ required_error: D.mandatoryProperty(property) })
		.trim()
		.min(1, { message: D.mandatoryProperty(property) });
};

const deburr = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');

const CollectionZod = (
	collectionList: CollectionsList,
	initialId: string,
	initialPrefLabelLg1: string,
) =>
	z.object({
		id: generateMandatoryAndNotEmptyField(D.idTitle).refine(
			(value) =>
				value === initialId ||
				!arrayKeepUniqueField(collectionList, 'id').includes(deburr(value)),
			{ message: D.duplicatedId },
		),
		prefLabelLg1: generateMandatoryAndNotEmptyField(D1.labelTitle).refine(
			(value) =>
				value === initialPrefLabelLg1 ||
				!arrayKeepUniqueField(collectionList, 'label').includes(deburr(value)),
			{ message: D.duplicatedLabel },
		),
		creator: generateMandatoryAndNotEmptyField(D.creatorTitle),
	});

export const validate = (
	general: Collection,
	collectionList: CollectionsList,
	initialId: string,
	initialPrefLabelLg1: string,
) =>
	formatValidation(
		CollectionZod(collectionList, initialId, initialPrefLabelLg1),
	)(general);
