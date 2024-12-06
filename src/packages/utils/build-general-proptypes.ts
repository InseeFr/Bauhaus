/* eslint  @typescript-eslint/no-unused-vars: 0 */
import objectFromKeys from './object-from-keys';

export const buildFields = (fieldsWithRequired: string[][]) =>
	fieldsWithRequired.map(([fieldName]) => fieldName);

export const buildEmpty = (fieldsWithRequired: string[][]) => {
	const general = objectFromKeys(buildFields(fieldsWithRequired), '');
	fieldsWithRequired.map(([field, _req, type]) =>
		type === 'array' ? (general[field] = []) : null,
	);
	return general;
};

export const buildEmptyWithContributor = (
	fieldsWithRequired: string[][],
	defaultContributor: string,
) => {
	const general = objectFromKeys(buildFields(fieldsWithRequired), '');
	general.contributor = defaultContributor;
	fieldsWithRequired.map(([field, _req, type]) =>
		type === 'array' ? (general[field] = []) : null,
	);
	return general;
};
