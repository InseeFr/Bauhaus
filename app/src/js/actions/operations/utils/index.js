import { ArrayUtils } from '../../../utils';

export default (remoteCall, LOADING, SUCCESS, FAILURE) => (dispatch) => {
	dispatch({
		type: LOADING,
		payload: {},
	});
	return remoteCall().then(
		(results) =>
			dispatch({
				type: SUCCESS,
				payload: { results: ArrayUtils.sortArrayByLabel(results) },
			}),
		(err) =>
			dispatch({
				type: FAILURE,
				payload: { err },
			})
	);
};

/**
 * This is a factory we use to create actions related to the publish action.
 * The callback paramter is used only if we need to display server-side error
 *
 * @param {*} remoteCall The method we must call in order to publish the object
 * @param {*} LOADING The name of the action when loading
 * @param {*} SUCCESS The name of the action if this is a success
 * @param {*} FAILURE The name of the action if this is an error
 */
export const getPublishFactory = (remoteCall, LOADING, SUCCESS, FAILURE) => {
	return (object, callback = () => {}) =>
		(dispatch) => {
			dispatch({
				type: LOADING,
				payload: {},
			});

			return remoteCall(object).then(
				(results) => {
					dispatch({
						type: SUCCESS,
						payload: results,
					});
					callback(null, results);
				},
				(err) => {
					dispatch({
						type: FAILURE,
						payload: { err },
					});
					callback(err);
				}
			);
		};
};

export const getItemFactory =
	(remoteCall, LOADING, SUCCESS, FAILURE) => (id) => (dispatch, getState) => {
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
			(results) =>
				dispatch({
					type: SUCCESS,
					payload: results,
				}),
			(err) =>
				dispatch({
					type: FAILURE,
					payload: { err },
				})
		);
	};
