import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';
import { defaultContributor } from 'config/config';
export const fields = [
	['prefLabelFr', false],
	['prefLabelEn', false],
	['altLabelFr', false],
	['altLabelEn', false],
	['disseminationStatus', false],
	['additionnalMaterial', false],
	['dateEnd', false],
	['creator', false],
	['contributor', false],
	['isValidated', false],
	['conceptVersion', true],
	['created', false],
];

export default fields;

export const propTypes = PropTypes.shape(
	fields.reduce((propTypes, [fieldName, isRequired]) => {
		propTypes[fieldName] = isRequired
			? PropTypes.string.isRequired
			: PropTypes.string;
		return propTypes;
	}, {})
);

export const empty = () => {
	const general = objectFromKeys(fields, '');
	general.contributor = defaultContributor;
	return general;
};
