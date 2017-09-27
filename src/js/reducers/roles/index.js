import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';

export const handleReset = (reducer, actions) => (state, action) => {
	//we pass the action to the reducer: it should have no effect, we just want
	//to reinitialize the reducer but we cannot pas `undefined` as an action
	if (actions.indexOf(action.type) !== -1) return reducer(undefined, action);
	return reducer(state, action);
};

const roleList = handleReset(
	listReducer([
		A.LOAD_ROLE_LIST,
		A.LOAD_ROLE_LIST_SUCCESS,
		A.LOAD_ROLE_LIST_FAILURE,
	]),
	[A.ADD_ROLE, A.DELETE_ROLE]
);

export default {
	roleList,
};
