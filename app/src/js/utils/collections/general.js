import {
	buildFields,
	buildEmpty,
	buildEmptyWithContributor,
} from '@inseefr/wilco';

export const fieldsWithRequired = [
	['id', false],
	['prefLabelLg1', false],
	['prefLabelLg2', false],
	['descriptionLg1', false],
	['descriptionLg2', false],
	['created', false],
	['modified', false],
	['creator', false],
	['contributor', false],
	['isValidated', false],
];

export const fields = buildFields(fieldsWithRequired);

export const empty = () => buildEmpty(fieldsWithRequired);

export const emptyWithContributor = (defaultContributor) =>
	buildEmptyWithContributor(fieldsWithRequired, defaultContributor);
