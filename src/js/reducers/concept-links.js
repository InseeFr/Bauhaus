import { LOAD_CONCEPT_LINKS_SUCCESS } from '../actions/concept';
import { LOADED } from 'js/constants';

export default function(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CONCEPT_LINKS_SUCCESS: {
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
