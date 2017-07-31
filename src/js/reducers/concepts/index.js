import conceptGeneral from './by-id/general';
import conceptNotes from './by-id/notes';
import conceptLinks from './by-id/links';
import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';

const conceptList = listReducer([
  A.LOAD_CONCEPT_LIST,
  A.LOAD_CONCEPT_LIST_SUCCESS,
  A.LOAD_CONCEPT_LIST_FAILURE,
]);

const conceptToValidateList = listReducer([
  A.LOAD_CONCEPT_VALIDATE_LIST,
  A.LOAD_CONCEPT_VALIDATE_LIST_SUCCESS,
  A.LOAD_CONCEPT_VALIDATE_LIST_FAILURE,
]);

const conceptSearchList = listReducer([
  A.LOAD_CONCEPT_SEARCH_LIST,
  A.LOAD_CONCEPT_SEARCH_LIST_SUCCESS,
  A.LOAD_CONCEPT_SEARCH_LIST_FAILURE,
]);

export default {
  conceptList,
  conceptSearchList,
  conceptToValidateList,
  conceptGeneral,
  conceptNotes,
  conceptLinks,
};
