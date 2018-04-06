import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';

export const fieldsWithRequired = [['prefLabelLg1', true]];

export const fields = fieldsWithRequired.map(([fieldName]) => fieldName);

export const propTypes = PropTypes.shape(
	fieldsWithRequired.reduce((propTypes, [fieldName, isRequired]) => {
		propTypes[fieldName] = isRequired
			? PropTypes.string.isRequired
			: PropTypes.string;
		return propTypes;
	}, {})
);

export const empty = () => {
	const general = objectFromKeys(fields, '');
	return general;
};
