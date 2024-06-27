import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';

const stampList = listReducer([
	A.LOAD_STAMP_LIST,
	A.LOAD_STAMP_LIST_SUCCESS,
	A.LOAD_STAMP_LIST_FAILURE,
]);

export default {
	stampList,
};

