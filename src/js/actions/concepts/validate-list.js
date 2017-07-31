import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(api.getConceptValidateList, [
  A.LOAD_CONCEPT_VALIDATE_LIST,
  A.LOAD_CONCEPT_VALIDATE_LIST_SUCCESS,
  A.LOAD_CONCEPT_VALIDATE_LIST_FAILURE,
]);
