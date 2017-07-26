import {
  LOAD_CONCEPTS_TO_EXPORT,
  LOAD_CONCEPTS_TO_EXPORT_SUCCESS,
} from '../actions/concepts-to-EXPORT';
import { LOADING, NOT_LOADED } from 'js/constants';
//TODO use a factory, same code as the `conceptsToValidate` reducer

export default function(state = { status: NOT_LOADED }, action) {
  switch (action.type) {
    case LOAD_CONCEPTS_TO_EXPORT:
      return {
        ...state,
        status: LOADING,
      };
    case LOAD_CONCEPTS_TO_EXPORT_SUCCESS:
      return {
        ...state,
        results: action.payload.results,
      };
    default:
      return state;
  }
}
