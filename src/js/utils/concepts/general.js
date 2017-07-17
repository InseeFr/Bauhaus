import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';
import { defaultContributor } from 'config/config';
export const fields = [
  'prefLabelFr',
  'prefLabelEn',
  'altLabelFr',
  'altLabelEn',
  'disseminationStatus',
  'additionnalMaterial',
  'dateEnd',
  'creator',
  'contributor',
  'isValidated',
  'conceptVersion',
  'created',
];

export default fields;

export const propTypes = PropTypes.shape(
  objectFromKeys(fields, PropTypes.string.isRequired)
);

export const empty = () => {
  const general = objectFromKeys(fields, '');
  general.contributor = defaultContributor;
  return general;
};
