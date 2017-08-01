import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(
  api.putConceptValidList,
  [
    A.VALIDATE_CONCEPT_LIST,
    A.VALIDATE_CONCEPT_LIST_SUCCESS,
    A.VALIDATE_CONCEPT_LIST_FAILURE,
  ],
  ids => ({ ids })
);
