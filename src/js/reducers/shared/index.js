import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';

const disseminationStatusList = listReducer([
	A.LOAD_DISSEMINATION_STATUS_LIST,
	A.LOAD_DISSEMINATION_STATUS_LIST_SUCCESS,
	A.LOAD_DISSEMINATION_STATUS_LIST_FAILURE,
]);

const stampList = listReducer([
	A.LOAD_STAMP_LIST,
	A.LOAD_STAMP_LIST_SUCCESS,
	A.LOAD_STAMP_LIST_FAILURE,
]);

export default {
	disseminationStatusList,
	stampList,
};

