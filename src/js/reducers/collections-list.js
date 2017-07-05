import { LOAD_COLLECTIONS_LIST_SUCCESS } from '../actions/collections-list';

export default function(state = [], action) {
  if (action.type === LOAD_COLLECTIONS_LIST_SUCCESS)
    return action.payload.results;
  return state;
}
