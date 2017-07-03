import { LOAD_CONCEPT_GENERAL_SUCCESS } from '../actions/concept-by-id';

export default function(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CONCEPT_GENERAL_SUCCESS: {
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
