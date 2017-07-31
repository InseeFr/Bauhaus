import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

//TODO handle the status in the store (for now, we only handle the remote
//call, and a `then` handler in the component take care of adjusting the
//status)
export default buildAsyncAction(
  api.getConceptGeneral,
  [A.UPDATE_CONCEPT, A.UPDATE_CONCEPT_SUCCESS, A.UPDATE_CONCEPT_FAILURE],
  (id, concept) => ({ id, concept })
);
