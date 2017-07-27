import PropTypes from 'prop-types';
import {
  BROADER,
  NARROWER,
  REFERENCES,
  SUCCEED,
  RELATED,
  NONE,
} from 'js/constants';

const constantsMapping = {
  [BROADER]: BROADER,
  [NARROWER]: NARROWER,
  [REFERENCES]: REFERENCES,
  [SUCCEED]: SUCCEED,
  [RELATED]: RELATED,
};
//TODO Fix me, prop types should be only the shape, not the array
export const propTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    typeOfLink: PropTypes.oneOf([
      BROADER,
      NARROWER,
      REFERENCES,
      SUCCEED,
      RELATED,
      NONE,
    ]),
  })
);
