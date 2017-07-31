import { LOAD_CONCEPT_SEARCH_LIST_SUCCESS } from '../actions/constants';
import { LOADED, NOT_LOADED } from 'js/constants';

export default function(state = { status: NOT_LOADED }, action) {
  if (action.type === LOAD_CONCEPT_SEARCH_LIST_SUCCESS)
    return {
      status: LOADED,
      results: action.payload.results,
    };
  return state;
}
