import api from '../../../remote-api/operations-api';
import * as A from '../../../actions/constants';
import { LOADING } from '../../../constants';
import { D1, D2 } from '../../../i18n';

import { getPublishFactory } from '../utils';

export const publishSims = getPublishFactory(
	api.publishSims,
	A.PUBLISH_OPERATIONS_SIMS,
	A.PUBLISH_OPERATIONS_SIMS_SUCCESS,
	A.PUBLISH_OPERATIONS_SIMS_FAILURE
);

/**
 * Method used to merge a SIMS with the label of its corresponding
 * parent.
 *
 * @param {*} sims
 * @param {*} promise
 */
function getFetchLabelsPromise(sims, promise) {
	function mergeLabels(parent) {
		return {
			...sims,
			labelLg1: D1.simsTitle + parent.prefLabelLg1,
			labelLg2: D2.simsTitle + parent.prefLabelLg2,
		};
	}
	if (sims.idOperation) {
		return api
			.getOperation(sims.idOperation)
			.then((parent) => mergeLabels(parent));
	}
	if (sims.idSeries) {
		return api.getSerie(sims.idSeries).then((parent) => mergeLabels(parent));
	}
	if (sims.idIndicator) {
		return api
			.getIndicatorById(sims.idIndicator)
			.then((parent) => mergeLabels(parent));
	}
	return promise;
}
/**
 * This method is called when we need to save a SIMS.
 * If the sims passed as a parameter already have an id,
 * we will send a PUT request. If this property is not
 * present, a POST request will be send.
 *
 * @param {Sims} sims
 * @param {(string) => void} callback
 */
export const saveSims = (sims, callback) => (dispatch) => {
	let promise = Promise.resolve(sims);

	if (!sims.labelLg1) {
		promise = getFetchLabelsPromise(sims, promise);
	}

	const method = sims.id ? 'putSims' : 'postSims';
	dispatch({
		type: A.SAVE_OPERATIONS_SIMS,
		payload: sims,
	});
	return promise.then((s) => {
		return api[method](s).then(
			(results) => {
				dispatch({
					type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
					payload: s,
				});
				callback(results || s.id);
			},
			(err) => {
				dispatch({
					type: A.SAVE_OPERATIONS_SIMS_FAILURE,
					payload: { err },
				});
			}
		);
	});
};

function getParentsWithoutSims(idOperation) {
	if (idOperation) {
		return api
			.getOperation(idOperation)
			.then((operation) => api.getOperationsWithoutReport(operation.series.id));
	}
	return Promise.resolve([]);
}

const fetchSims = (id) => (dispatch, getState) => {
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
		(results) => {
			const rubrics = results.rubrics || [];
			return getParentsWithoutSims(results.idOperation).then(
				(parentsWithoutSims = []) => {
					dispatch({
						type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
						payload: {
							...results,
							parentsWithoutSims,
							rubrics: rubrics.reduce((acc, rubric) => {
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
				}
			);
		},

		(err) => {
			dispatch({
				type: A.LOAD_OPERATIONS_SIMS_LIST_FAILURE,
				payload: { err },
			});
		}
	);
};
export default fetchSims;
