import { LOAD_CONCEPTS_SEARCH_LIST_SUCCESS } from '../actions/concepts-search-list';

export default function(state = [], action) {
  if (action.type === LOAD_CONCEPTS_SEARCH_LIST_SUCCESS)
    return action.payload.results;
  return state;
}
