import api from 'js/remote-api/api';
import buildLoadAction from './utils/build-async-action';
import * as A from './constants';

export const loadStampList = buildLoadAction(api.getStampList, [
  A.LOAD_STAMP_LIST,
  A.LOAD_STAMP_LIST_SUCCESS,
  A.LOAD_STAMP_LIST_FAILURE,
]);

export const loadDissStatusList = buildLoadAction(api.getDissStatusList, [
  A.LOAD_DISS_STATUS_LIST,
  A.LOAD_DISS_STATUS_LIST_SUCCESS,
  A.LOAD_DISS_STATUS_LIST_FAILURE,
]);
