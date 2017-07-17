import { LOAD_CONCEPT_LINKS_SUCCESS } from '../actions/concept';

export default function(state = [], action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CONCEPT_LINKS_SUCCESS: {
      const { id, results } = payload;
      return {
        ...state,
        [id]: results,
      };
    }
    default:
      return state;
  }
}
