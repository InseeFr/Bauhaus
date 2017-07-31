import { buildLoadAction } from '../utils/no-arg-async-action';

export const loadStampList = buildLoadAction(getStampList, [
  LOAD_STAMP_LIST,
  LOAD_STAMP_LIST_SUCCESS,
  LOAD_STAMP_LIST_FAILURE,
]);

export const loadDissStatusList = buildLoadAction(getDissStatusList, [
  LOAD_DISS_STATUS_LIST,
  LOAD_DISS_STATUS_LIST_SUCCESS,
  LOAD_DISS_STATUS_LIST_FAILURE,
]);
