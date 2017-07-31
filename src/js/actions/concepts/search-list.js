import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(api.getConceptSearchList, [
  A.LOAD_CONCEPT_SEARCH_LIST,
  A.LOAD_CONCEPT_SEARCH_LIST_SUCCESS,
  A.LOAD_CONCEPT_SEARCH_LIST_FAILURE,
]);
