import {
  LOAD_CONCEPT_LIST,
  LOAD_CONCEPT_LIST_SUCCESS,
  LOAD_CONCEPT_LIST_FAILURE,
} from '../actions/constants';

import { NOT_LOADED, LOADING, LOADED, FAILURE } from 'js/constants';

export default function(state = { status: NOT_LOADED }, action) {
  switch (action.type) {
    case LOAD_CONCEPT_LIST:
      return { ...state, status: LOADING };
    case LOAD_CONCEPT_LIST_SUCCESS:
      return { status: LOADED, results: action.payload.results };
    case LOAD_CONCEPT_LIST_FAILURE:
      return { status: FAILURE, err: action.payload.err };
    default:
      return state;
  }
}
