import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(
  api.postConceptSend,
  [A.SEND_CONCEPT, A.SEND_CONCEPT_SUCCESS, A.SEND_CONCEPT_FAILURE],
  (id, mailInfo) => ({
    id,
    mailInfo,
  })
);
