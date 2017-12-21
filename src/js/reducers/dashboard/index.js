import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';

const collectionDashboardList = listReducer([
	A.LOAD_COLLECTION_DASHBOARD_LIST,
	A.LOAD_COLLECTION_DASHBOARD_LIST_SUCCESS,
	A.LOAD_COLLECTION_DASHBOARD_LIST_FAILURE,
]);

export default {
	collectionDashboardList,
};
