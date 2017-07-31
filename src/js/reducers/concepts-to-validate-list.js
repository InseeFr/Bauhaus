import {
  LOAD_CONCEPT_VALIDATE_LIST,
  LOAD_CONCEPT_VALIDATE_LIST_SUCCESS,
} from '../actions/constants';
import { LOADING, NOT_LOADED } from 'js/constants';
export default function(state = { status: NOT_LOADED }, action) {
  switch (action.type) {
    case LOAD_CONCEPT_VALIDATE_LIST:
      return {
        ...state,
        status: LOADING,
      };
    case LOAD_CONCEPT_VALIDATE_LIST_SUCCESS:
      return {
        ...state,
        results: action.payload.results,
      };
    default:
      return state;
  }
}
