import { LOAD_CONCEPTS_SEARCH_LIST_SUCCESS } from '../actions/concepts-search-list';
import { LOADED, NOT_LOADED } from 'js/constants';

export default function(state = { status: NOT_LOADED }, action) {
  if (action.type === LOAD_CONCEPTS_SEARCH_LIST_SUCCESS)
    return {
      status: LOADED,
      results: action.payload.results,
    };
  return state;
}
