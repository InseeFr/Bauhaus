import { PENDING, OK } from 'js/constants';
import * as A from 'js/actions/constants';

export const trackActionReducer = actions => (state = {}, action) => {
	const startActions = [];
	const successActions = [];
	actions.forEach(([start, sucess]) => {
		startActions.push(start);
		successActions.push(sucess);
	});
	if (startActions.indexOf(action.type) !== -1) {
		return {
			...state,
			[action.type]: {
				status: PENDING,
				...action.payload,
			},
		};
	} else {
		const actionIndex = successActions.indexOf(action.type);
		if (actionIndex !== -1) {
			return {
				...state,
				[startActions[actionIndex]]: {
					status: OK,
					...action.payload,
				},
			};
		}
	}
	return state;
};
/**
 * Reducer to keep track of POST and PUT calls
 *
 * Handles a status variable which can be valued to wait until the action
 * has been processed to rediret the user.
 *
 * It might be relevant to use that kind of reducer for export and validate actions,
 * but for creation and updates of concepts, we's better track the status within the
 * COLLECTION reducer (-> creating a temporary id for `CREATE_ACTION` action)
 *

 */
export default trackActionReducer([
	[A.CREATE_CONCEPT, A.CREATE_CONCEPT_SUCCESS],
	[A.UPDATE_CONCEPT, A.UPDATE_CONCEPT_SUCCESS],
	[A.EXPORT_CONCEPT_LIST, A.EXPORT_CONCEPT_LIST_SUCCESS],
	[A.SEND_CONCEPT, A.SEND_CONCEPT_SUCCESS],
	[A.VALIDATE_CONCEPT_LIST, A.VALIDATE_CONCEPT_LIST_SUCCESS],
	[A.CREATE_COLLECTION, A.CREATE_COLLECTION_SUCCESS],
	[A.UPDATE_COLLECTION, A.UPDATE_COLLECTION_SUCCESS],
	[A.EXPORT_COLLECTION_LIST, A.EXPORT_COLLECTION_LIST_SUCCESS],
	[A.SEND_COLLECTION, A.SEND_COLLECTION_SUCCESS],
	[A.VALIDATE_COLLECTION_LIST, A.VALIDATE_COLLECTION_LIST_SUCCESS],
	[A.ADD_ROLE, A.ADD_ROLE_SUCCESS],
	[A.DELETE_ROLE, A.DELETE_ROLE_SUCCESS],
	[A.EXPORT_VARBOOK, A.EXPORT_VARBOOK_SUCCESS],
]);

export const getStatus = (state, actionType) => {
	return state[actionType] && state[actionType].status;
};

export const getNewlyCreatedId = state =>
	state[A.CREATE_CONCEPT] && state[A.CREATE_CONCEPT].id;
