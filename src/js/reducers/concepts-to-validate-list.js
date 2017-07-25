import {
  LOAD_CONCEPTS_TO_VALIDATE,
  LOAD_CONCEPTS_TO_VALIDATE_SUCCESS,
} from '../actions/concepts-to-validate';
import { LOADING, NOT_LOADED } from 'js/constants';
export default function(state = { status: NOT_LOADED }, action) {
  switch (action.type) {
    case LOAD_CONCEPTS_TO_VALIDATE:
      return {
        ...state,
        status: LOADING,
      };
    case LOAD_CONCEPTS_TO_VALIDATE_SUCCESS:
      return {
        ...state,
        results: action.payload.results,
      };
    default:
      return state;
  }
}
