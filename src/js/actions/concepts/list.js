import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(api.getConceptList, [
  A.LOAD_CONCEPT_LIST,
  A.LOAD_CONCEPT_LIST_SUCCESS,
  A.LOAD_CONCEPT_LIST_FAILURE,
]);
