import api from '../remote-api/concepts-api';
import buildLoadAction from './utils/build-async-action';
import * as A from './constants';

export const loadStampList = buildLoadAction(api.getStampList, [
	A.LOAD_STAMP_LIST,
	A.LOAD_STAMP_LIST_SUCCESS,
	A.LOAD_STAMP_LIST_FAILURE,
]);
