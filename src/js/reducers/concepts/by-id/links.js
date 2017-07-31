import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';

export default function(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case A.LOAD_CONCEPT_LINKS_SUCCESS: {
      const { id, results } = payload;
      return {
        ...state,
        [id]: {
          status: LOADED,
          results,
        },
      };
    }
    default:
      return state;
  }
}

export function getLinks(state, conceptId) {
  return state[conceptId] && state[conceptId].results;
}
