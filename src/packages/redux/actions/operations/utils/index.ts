import { Dispatch } from 'redux';
import { sortArrayByLabel } from '../../../../utils/array-utils';

const call =
	(remoteCall: any, LOADING: any, SUCCESS: any, FAILURE: any) =>
	(dispatch: Dispatch) => {
		dispatch({
			type: LOADING,
			payload: {},
		});
		return remoteCall().then(
			(results: any) =>
				dispatch({
					type: SUCCESS,
					payload: { results: sortArrayByLabel(results) },
				}),
			(err: any) =>
				dispatch({
					type: FAILURE,
					payload: { err },
				}),
		);
	};
export default call;
/**
 * This is a factory we use to create actions related to the publish action.
 * The callback paramter is used only if we need to display server-side error
 *
 * @param {*} remoteCall The method we must call in order to publish the object
 * @param {*} LOADING The name of the action when loading
 * @param {*} SUCCESS The name of the action if this is a success
 * @param {*} FAILURE The name of the action if this is an error
 */
export const getPublishFactory = (
	remoteCall: any,
	LOADING: any,
	SUCCESS: any,
	FAILURE: any,
) => {
	return (object: any, callback = () => {}) =>
		(dispatch: Dispatch) => {
			dispatch({
				type: LOADING,
				payload: {},
			});

			return remoteCall(object).then(
				(results: any) => {
					dispatch({
						type: SUCCESS,
						payload: results,
					});
					callback(null, results);
				},
				(err: any) => {
					dispatch({
						type: FAILURE,
						payload: { err },
					});
					callback(err);
				},
			);
		};
};

export const getItemFactory =
	(remoteCall: any, LOADING: any, SUCCESS: any, FAILURE: any) =>
	(id: string) =>
	(dispatch: Dispatch, getState: any) => {
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
			(results: any) =>
				dispatch({
					type: SUCCESS,
					payload: results,
				}),
			(err: any) =>
				dispatch({
					type: FAILURE,
					payload: { err },
				}),
		);
	};
