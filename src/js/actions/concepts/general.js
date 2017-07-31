import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(
  api.getConceptGeneral,
  [
    A.LOAD_CONCEPT_GENERAL,
    A.LOAD_CONCEPT_GENERAL_SUCCESS,
    A.LOAD_CONCEPT_GENERAL_FAILURE,
  ],
  id => ({ id })
);
