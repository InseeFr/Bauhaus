import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';

export const fieldsWithRequired = [
	['prefLabelLg1', true],
	['prefLabelLg2', false],
	['altLabelLg1', false],
	['altLabelLg2', false],
	['seriesLg1', false],
	['seriesLg2', false],
	['idSeries', false],
	['afterLg1', false],
	['afterLg2', false],
	['idAfter', false],
	['beforeLg1', false],
	['beforeLg2', false],
	['idBefore', false],
	['variantLg1', false],
	['variantLg2', false],
	['idVariant', false],
	['issued', false],
	['valid', false],
	['lastRefreshedOn', false],
	['additionalMaterial', false],
	['rights', false],
	['creator', false],
	['contributor', false],
	['disseminationStatus', false],
	['legalMaterial', false],
	['homepage', false],
	['scopeNoteLg1', false],
	['scopeNoteLg2', false],
	['changeNoteLg1', false],
	['changeNoteLg2', false],
	['descriptionLg1', false],
	['descriptionLg2', false],
];

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
