import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(api.getConceptExport, [
  A.EXPORT_CONCEPT,
  A.EXPORT_CONCEPT_SUCCESS,
  A.EXPORT_CONCEPT_FAILURE,
]);
