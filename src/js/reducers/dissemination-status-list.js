import { LOAD_DISSEMINATION_STATUS_LIST_SUCCESS } from '../actions/dissemination-status';
import { NOT_LOADED, LOADED } from 'js/constants';

export default function(state = { status: NOT_LOADED }, action) {
  if (action.type === LOAD_DISSEMINATION_STATUS_LIST_SUCCESS)
    return {
      status: LOADED,
      results: action.payload.results.map(({ label }) => label),
    };
  return state;
}
