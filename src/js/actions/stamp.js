import api from 'js/remote-api/api';
import buildAsyncAction from './utils/build-async-action';
import * as A from './constants';

export default buildAsyncAction(api.getStampList, [
  A.LOAD_STAMP_LIST,
  A.LOAD_STAMP_LIST_SUCCESS,
  A.LOAD_STAMP_LIST_FAILURE,
]);
