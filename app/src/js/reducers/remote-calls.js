import { PENDING, OK, KO } from 'js/constants';
import * as A from 'js/actions/constants';

const trackResetReducer = (state = {}, actions) => {
	const newState = Object.keys(state).reduce((acc, value) => {
		if (actions.includes(value)) {
			return acc;
		}
		return {
			...acc,
			[value]: state[value],
		};
	}, {});

	return newState;
};

export const trackActionReducer = actions => (state = {}, action) => {
	const startActions = [];
	const successActions = [];
	const failActions = [];
	const resetActions = [];

	actions.forEach(([start, sucess, fail, reset = []]) => {
		startActions.push(start);
		successActions.push(sucess);
		failActions.push(fail);
		resetActions.push(...reset);
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
		const failIndex = failActions.indexOf(action.type);
		if (actionIndex !== -1) {
			return {
				...state,
				[startActions[actionIndex]]: {
					status: OK,
					...action.payload,
				},
			};
		}
		if (failIndex !== -1) {
			return {
				...state,
				[startActions[failIndex]]: {
					status: KO,
					...action.payload,
				},
			};
		}
	}

	if (resetActions.includes(action.type)) {
		const stateToDelete = actions
			.filter(actions => {
				return actions[3]?.includes(action.type);
			})
			.reduce(
				(acc, actions) => [...acc, actions[0], actions[1], actions[2]],
				[]
			);

		return trackResetReducer(state, stateToDelete);
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
	[A.EXPORT_VARBOOK, A.EXPORT_VARBOOK_SUCCESS],
]);
