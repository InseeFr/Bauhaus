import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';
import { defaultContributor } from 'config/config';
export const fieldsWithRequired = [
  ['prefLabelLg1', false],
  ['prefLabelLg2', false],
  ['altLabelLg1', false],
  ['altLabelLg2', false],
  ['disseminationStatus', false],
  ['additionalMaterial', false],
  ['valid', false],
  ['creator', false],
  ['contributor', false],
  ['isValidated', false],
  ['conceptVersion', true],
  ['created', false],
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
  general.contributor = defaultContributor;
  return general;
};
