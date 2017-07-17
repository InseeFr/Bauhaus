import PropTypes from 'prop-types';
import { PARENT, CHILD, REF, SUCCEED, RELATED, NONE } from 'js/constants';

const constantsMapping = {
  [PARENT]: 'memberParent',
  [CHILD]: 'memberEnfants',
  [REF]: 'memberRef',
  [SUCCEED]: 'memberSucceed',
  [RELATED]: 'memberLink',
};
export const propTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    typeOfLink: PropTypes.oneOf([PARENT, CHILD, REF, SUCCEED, RELATED, NONE]),
  })
);
export function extractLinks(conceptsWithLinks) {
  return conceptsWithLinks.reducer(
    (links, { id, typeOfLink }) => {
      links[constantsMapping[typeOfLink]] = {
        //TODO check remote api expectations: does it need additional information
        // (like `prefLabelFr`) ? does it expect an object with an entry by `id` ?
        // is the value significant ? or does it expect an array ?
        id,
      };
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
