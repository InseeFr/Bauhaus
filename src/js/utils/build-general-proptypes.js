import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';

export const buildFields = fieldsWithRequired =>
	fieldsWithRequired.map(([fieldName]) => fieldName);

export const buildPropTypes = fieldsWithRequired =>
	PropTypes.shape(
		fieldsWithRequired.reduce((propTypes, [fieldName, isRequired]) => {
			propTypes[fieldName] = isRequired
				? PropTypes.string.isRequired
				: PropTypes.string;
			return propTypes;
		}, {})
	);

export const buildEmpty = fieldsWithRequired => {
	const general = objectFromKeys(buildFields(fieldsWithRequired), '');
	return general;
};

export const buildEmptyWithContributor = (
	fieldsWithRequired,
	defaultContributor
) => {
	const general = objectFromKeys(buildFields(fieldsWithRequired), '');
	general.contributor = defaultContributor;
	return general;
};
