import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import { LOADING } from 'js/constants';
import {getLabelsFromOperation} from 'js/utils/msd' 

export const saveSims = (sims, callback) => (dispatch, getState) => {
	let promise = Promise.resolve(sims);

	if (!sims.labelLg1 && sims.idOperation) {
		promise = api.getOperation(sims.idOperation).then(result => {
			return {
				...sims,
				...getLabelsFromOperation(result)
			};
		});
	}

	const method = sims.id ? 'putSims' : 'postSims';
	dispatch({
		type: A.SAVE_OPERATIONS_SIMS,
		payload: sims,
	});
	return promise.then(sims => {
		return api[method](sims).then(
			results => {
				dispatch({
					type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
					payload: sims,
				});
				callback(results || sims.id);
			},
			err => {
				dispatch({
					type: A.SAVE_OPERATIONS_SIMS_FAILURE,
					payload: { err },
				});
			}
		);
	});
};

export default id => (dispatch, getState) => {
	if (!id || getState().operationsSimsCurrentStatus === LOADING) {
		return;
	}
	dispatch({
		type: A.LOAD_OPERATIONS_SIMS,
		payload: {
			id,
		},
	});
	return api.getSims(id).then(
		results => {
			api
				.getOperation(results.idOperation)
				.then(operation => api.getOperationsWithoutReport(operation.series.id))
				.then((operationsWithoutSims = []) => {
					dispatch({
						type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
						payload: {
							...results,
							operationsWithoutSims: operationsWithoutSims.filter(
								op => !!op.labelLg1
							),
							rubrics: results.rubrics.reduce((acc, rubric) => {
								return {
									...acc,
									[rubric.idAttribute]: {
										...rubric,
										idMas: rubric.idAttribute,
									},
								};
							}, {}),
						},
					});
				});
		},

		err => {
			dispatch({
				type: A.LOAD_OPERATIONS_SIMS_LIST_FAILURE,
				payload: { err },
			});
		}
	);
};
