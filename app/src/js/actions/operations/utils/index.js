import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

export default (remoteCall, LOADING, SUCCESS, FAILURE) => dispatch => {
	dispatch({
		type: LOADING,
		payload: {},
	});
	return remoteCall().then(
		results =>
			dispatch({
				type: SUCCESS,
				payload: { results: sortByLabel(results) },
			}),
		err =>
			dispatch({
				type: FAILURE,
				payload: { err },
			})
	);
};

// TODO Add Unit Test
export const getPublishFactory = (remoteCall, LOADING, SUCCESS, FAILURE) => {
	return (object, callback = () => {}) => dispatch => {
		dispatch({
			type: LOADING,
			payload: {},
		});

		return remoteCall(object).then(
			results => {
				dispatch({
					type: SUCCESS,
					payload: results,
				});
				callback(null, results);
			},
			err => {
				dispatch({
					type: FAILURE,
					payload: { err },
				});
				callback(err);
			}
		);
	};
};

export const getItemFactory = (remoteCall, LOADING, SUCCESS, FAILURE) => id => (
	dispatch,
	getState
) => {
	if (getState().operationsOperationCurrentStatus === LOADING) {
		return;
	}
	dispatch({
		type: LOADING,
		payload: {
			id,
		},
	});
	return remoteCall(id).then(
		results =>
			dispatch({
				type: SUCCESS,
				payload: results,
			}),
		err =>
			dispatch({
				type: FAILURE,
				payload: { err },
			})
	);
};
