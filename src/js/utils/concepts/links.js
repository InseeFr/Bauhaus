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
export function extractLinks(conceptsWithLinks) {
  return conceptsWithLinks.reduce(
    (links, { id, typeOfLink }) => {
      const typeOfLinkFinal = constantsMapping[typeOfLink];
      //ignore `NONE`
      if (typeOfLinkFinal) {
        links[typeOfLinkFinal].push({
          //TODO check remote api expectations: does it need additional information
          // (like `prefLabelLg1`) ? does it expect an object with an entry by `id` ?
          // is the value significant ? or does it expect an array ?
          id,
        });
      }
      return links;
    },
    {
      [BROADER]: [],
      [NARROWER]: [],
      [REFERENCES]: [],
      [SUCCEED]: [],
      [RELATED]: [],
    }
  );
}
