import api from 'js/remote-api/api';
import buildAsyncAction from './utils/build-async-action';
import * as A from './constants';

export default buildAsyncAction(api.getDissStatusList, [
  A.LOAD_DISSEMINATION_STATUS_LIST,
  A.LOAD_DISSEMINATION_STATUS_LIST_SUCCESS,
  A.LOAD_DISSEMINATION_STATUS_LIST_FAILURE,
]);
