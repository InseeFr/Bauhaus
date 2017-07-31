import { LOAD_STAMP_LIST_SUCCESS } from '../actions/constants';

import { NOT_LOADED, LOADED } from 'js/constants';

export default function(state = { status: NOT_LOADED }, action) {
  if (action.type === LOAD_STAMP_LIST_SUCCESS)
    return {
      status: LOADED,
      results: action.payload.results,
    };
  return state;
}
