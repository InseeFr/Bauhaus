import { LOAD_CONCEPT_GENERAL_SUCCESS } from '../actions/concept';
import { LOADED } from 'js/constants';
import { empty } from 'js/utils/concepts/general';
export default function(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CONCEPT_GENERAL_SUCCESS: {
      const { id, results } = payload;
      return {
        ...state,
        [id]: {
          status: LOADED,
          //ensure that all the fields are present (the server
          //does not return the fields not defined)
          results: Object.assign(empty(), results),
        },
      };
    }
    default:
      return state;
  }
}
