import objectFromKeys from './object-from-keys';

export const buildFields = (fieldsWithRequired) =>
	fieldsWithRequired.map(([fieldName]) => fieldName);

export const buildEmpty = (fieldsWithRequired) => {
	const general = objectFromKeys(buildFields(fieldsWithRequired), '');
	fieldsWithRequired.map(([field, req, type]) =>
		type === 'array' ? (general[field] = []) : null
	);
	return general;
};

export const buildEmptyWithContributor = (
	fieldsWithRequired,
	defaultContributor
) => {
	const general = objectFromKeys(buildFields(fieldsWithRequired), '');
	general.contributor = defaultContributor;
	fieldsWithRequired.map(([field, req, type]) =>
		type === 'array' ? (general[field] = []) : null
	);
	return general;
};
