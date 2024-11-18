import * as A from '../../../actions/constants';
import { D1, D2 } from '../../../../deprecated-locales';

import { OperationsApi } from '@sdk/operations-api';
import { Rubric } from '../../../../model/Sims';
import { LOADING } from '@sdk/constants';
import { getPublishFactory } from '../utils';

export const publishSims = getPublishFactory(
	OperationsApi.publishSims,
	A.PUBLISH_OPERATIONS_SIMS,
	A.PUBLISH_OPERATIONS_SIMS_SUCCESS,
	A.PUBLISH_OPERATIONS_SIMS_FAILURE,
);

/**
 * Method used to merge a SIMS with the label of its corresponding
 * parent.
 *
 * @param {*} sims
 * @param {*} promise
 */
function getFetchLabelsPromise(sims: any, promise: any) {
	function mergeLabels(parent: any) {
		return {
			...sims,
			labelLg1: D1.simsTitle + parent.prefLabelLg1,
			labelLg2: D2.simsTitle + parent.prefLabelLg2,
		};
	}
	if (sims.idOperation) {
		return OperationsApi.getOperation(sims.idOperation).then((parent: any) =>
			mergeLabels(parent),
		);
	}
	if (sims.idSeries) {
		return OperationsApi.getSerie(sims.idSeries).then((parent: any) =>
			mergeLabels(parent),
		);
	}
	if (sims.idIndicator) {
		return OperationsApi.getIndicatorById(sims.idIndicator).then(
			(parent: any) => mergeLabels(parent),
		);
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
export const saveSims = (sims: any, callback: any) => (dispatch: any) => {
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
		return OperationsApi[method](s).then(
			(results: any) => {
				dispatch({
					type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
					payload: s,
				});
				callback(results || s.id);
			},
			(err: unknown) => {
				dispatch({
					type: A.SAVE_OPERATIONS_SIMS_FAILURE,
					payload: { err },
				});
			},
		);
	});
};

function getParentsWithoutSims(idOperation: string) {
	if (idOperation) {
		return OperationsApi.getOperation(idOperation).then((operation: any) =>
			OperationsApi.getOperationsWithoutReport(operation.series.id),
		);
	}
	return Promise.resolve([]);
}

const computeRubrics = (
	rubrics: Rubric[],
): Record<string, Rubric & { idMas: string }> => {
	return (rubrics || []).reduce((acc: any, rubric: any) => {
		return {
			...acc,
			[rubric.idAttribute]: {
				...rubric,
				idMas: rubric.idAttribute,
			},
		};
	}, {});
};

const fetchSims = (id: string) => (dispatch: any, getState: any) => {
	const dispatchSimsSuccess = (results: any, parentsWithoutSims: any[]) => {
		dispatch({
			type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
			payload: {
				...results,
				parentsWithoutSims,
				rubrics: computeRubrics(results.rubrics),
			},
		});
	};

	if (!id || getState().operationsSimsCurrentStatus === LOADING) {
		return;
	}
	dispatch({
		type: A.LOAD_OPERATIONS_SIMS,
		payload: {
			id,
		},
	});

	return OperationsApi.getSims(id).then(
		(results: any) => {
			return getParentsWithoutSims(results.idOperation).then(
				(parentsWithoutSims = []) => {
					dispatchSimsSuccess(results, parentsWithoutSims);
				},
			);
		},

		(err: unknown) => {
			dispatch({
				type: A.LOAD_OPERATIONS_SIMS_LIST_FAILURE,
				payload: { err },
			});
		},
	);
};
export default fetchSims;
