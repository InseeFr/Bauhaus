import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

//TODO handle the status in the store (for now, we only handle the remote
//call, and a `then` handler in the component take care of adjusting the
//status)
export default buildAsyncAction(
  api.postConcept,
  [A.CREATE_CONCEPT, A.CREATE_CONCEPT_SUCCESS, A.CREATE_CONCEPT_FAILURE],
  //build the payload
  concept => ({ concept }),
  //process the response
  concept => id => ({
    id,
    concept,
  })
);
