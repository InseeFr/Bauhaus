import listReducer from '../utils/list-reducer';
import * as A from '../../actions/constants';

const stampList = listReducer([
	A.LOAD_STAMP_LIST,
	A.LOAD_STAMP_LIST_SUCCESS,
	A.LOAD_STAMP_LIST_FAILURE,
]);

const stamp = {
	stampList,
};

export default stamp;
