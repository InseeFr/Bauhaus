import PropTypes from 'prop-types';
import { PARENT, CHILD, REF, SUCCEED, RELATED, NONE } from 'js/constants';

const constantsMapping = {
  [PARENT]: 'memberParent',
  [CHILD]: 'memberEnfants',
  [REF]: 'memberRef',
  [SUCCEED]: 'memberSucceed',
  [RELATED]: 'memberLink',
};
//TODO Fix me, prop types should be only the shape, not the array
export const propTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    typeOfLink: PropTypes.oneOf([PARENT, CHILD, REF, SUCCEED, RELATED, NONE]),
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
          // (like `prefLabelFr`) ? does it expect an object with an entry by `id` ?
          // is the value significant ? or does it expect an array ?
          id,
        });
      }
      return links;
    },
    {
      //`memberParent` should not be an array
      memberParent: [],
      memberEnfants: [],
      memberRef: [],
      memberSucceed: [],
      memberLink: [],
    }
  );
}
