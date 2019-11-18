import PropTypes from 'prop-types';
import objectFromKeys from './object-from-keys';

export const buildFields = fieldsWithRequired =>
	fieldsWithRequired.map(([fieldName]) => fieldName);

export const buildPropTypes = fieldsWithRequired =>
	PropTypes.shape(
		fieldsWithRequired.reduce((propTypes, [fieldName, isRequired, type]) => {
			const t = type ? type : 'string';
			propTypes[fieldName] = isRequired
				? PropTypes[t].isRequired
				: PropTypes[t];
			return propTypes;
		}, {})
	);

export const buildEmpty = fieldsWithRequired => {
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
