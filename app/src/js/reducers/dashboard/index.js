import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';

export const handleReset = (reducer, actions) => (state, action) => {
	//we pass the action to the reducer: it should have no effect, we just want
	//to reinitialize the reducer but we cannot pas `undefined` as an action
	if (actions.indexOf(action.type) !== -1) return reducer(undefined, action);
	return reducer(state, action);
};

const collectionDashboardList = handleReset(
	listReducer([
		A.LOAD_COLLECTION_DASHBOARD_LIST,
		A.LOAD_COLLECTION_DASHBOARD_LIST_SUCCESS,
		A.LOAD_COLLECTION_DASHBOARD_LIST_FAILURE,
	]),
	[A.CREATE_COLLECTION, A.UPDATE_COLLECTION, A.VALIDATE_COLLECTION_LIST]
);

export default {
	collectionDashboardList,
};
