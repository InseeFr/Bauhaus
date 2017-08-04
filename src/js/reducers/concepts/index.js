import conceptGeneral from './by-id/general';
import conceptNotes from './by-id/notes';
import conceptLinks from './by-id/links';
import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';

export const handleReset = (reducer, actions) => (state, action) => {
  //we pass the aciton to the reducer: it should have no effect, we just want
  //to reinitialize the reducer but we cannot pas `undefined` as an action
  if (actions.indexOf(action.type) !== -1) return reducer(undefined, action);
  return reducer(state, action);
};

const conceptList = handleReset(
  listReducer([
    A.LOAD_CONCEPT_LIST,
    A.LOAD_CONCEPT_LIST_SUCCESS,
    A.LOAD_CONCEPT_LIST_FAILURE,
  ]),
  [A.CREATE_CONCEPT, A.UPDATE_CONCEPT]
);

const conceptToValidateList = handleReset(
  listReducer([
    A.LOAD_CONCEPT_VALIDATE_LIST,
    A.LOAD_CONCEPT_VALIDATE_LIST_SUCCESS,
    A.LOAD_CONCEPT_VALIDATE_LIST_FAILURE,
  ]),
  [A.CREATE_CONCEPT, A.UPDATE_CONCEPT, A.VALIDATE_CONCEPT_LIST]
);

const conceptSearchList = handleReset(
  listReducer([
    A.LOAD_CONCEPT_SEARCH_LIST,
    A.LOAD_CONCEPT_SEARCH_LIST_SUCCESS,
    A.LOAD_CONCEPT_SEARCH_LIST_FAILURE,
  ]),
  [A.CREATE_CONCEPT, A.UPDATE_CONCEPT]
);

export default {
  conceptList,
  conceptSearchList,
  conceptToValidateList,
  conceptGeneral,
  conceptNotes,
  conceptLinks,
};
