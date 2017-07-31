import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(
  api.getConceptLinkList,
  [
    A.LOAD_CONCEPT_LINKS,
    A.LOAD_CONCEPT_LINKS_SUCCESS,
    A.LOAD_CONCEPT_LINKS_FAILURE,
  ],
  id => ({ id })
);
