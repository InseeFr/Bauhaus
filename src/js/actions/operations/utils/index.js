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
