import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import { LOADING } from 'js/constants';
import { getLabelsFromParent } from 'js/utils/msd';

/**
 * @typedef {Object} Sims
 * @property {string=} id
 * @property {string=} labelLg1
 * @property {SimsDocuments[]} documents
 */

/**
 * @typedef {Object} SimsDocuments
 * @property {string} uri
 * @property {string} url
 * @property {string=} updatedDate
 * @property {string} labelLg1
 * @property {string} labelLg2
 * @property {string=} lang
 * @property {string} descriptionLg1
 * @property {string} descriptionLg2
 */

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
			...getLabelsFromParent(parent),
		};
	}
	if (sims.idOperation) {
		return api.getOperation(sims.idOperation).then(mergeLabels);
	}
	if (sims.idSeries) {
		return api.getSerie(sims.idSeries).then(mergeLabels);
	}
	if (sims.idIndicator) {
		return api.getIndicator(sims.idIndicator).then(mergeLabels);
	}
	return promise;
}
/**
 * This method is called when we need to save a SIMS.
 * If the sims passed as a parameter already have an id,
 * we will send a PUR request. If this property is not
 * present, a POST request will be send.
 *
 * @param {Sims} sims
 * @param {(string) => void} callback
 */
export const saveSims = (sims, callback) => dispatch => {
	let promise = Promise.resolve(sims);

	if (!sims.labelLg1) {
		promise = getFetchLabelsPromise(sims, promise);
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

function getParentsWithoutSims(idOperation) {
	if (idOperation) {
		return api
			.getOperation(idOperation)
			.then(operation => api.getOperationsWithoutReport(operation.series.id));
	}
	return Promise.resolve([]);
}

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
			return getParentsWithoutSims(results.idOperation).then(
				(parentsWithoutSims = []) => {
					dispatch({
						type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
						payload: {
							...results,
							parentsWithoutSims,
							rubrics: results.rubrics.reduce((acc, rubric) => {
								// TO BE DELETED
								const documents = [
									{
										uri: 'uri1-bis',
										url: 'http://google.fr?q=url-1',
										updatedDate: '01/01/2019',
										lang: 'fr',
										labelLg1: 'Document 1 - label en Langue 1',
										labelLg2: 'Document 1 - label en Langue 2',
										descriptionLg1: 'Description 1 en Langue 1',
										descriptionLg2: 'Description 1 en Langue 2',
									},
									{
										uri: 'uri2-bis',
										url: 'http://google.fr?q=url-2',
										updatedDate: '01/02/2019',
										labelLg1: 'Document 2 - label en Langue 1',
										labelLg2: 'Document 2 - label en Langue 2',
										descriptionLg1: 'Description 2 en Langue 1',
										descriptionLg2: 'Description 2 en Langue 2',
									},
									{
										uri: 'uri3-bis',
										url: 'http://google.fr?q=url-2',
										labelLg1: 'Document 3 - label en Langue 1',
										labelLg2: 'Document 3 - label en Langue 2',
										descriptionLg1: 'Description 3 en Langue 1',
										descriptionLg2: 'Description 3 en Langue 2',
										lang: 'fr',
									},
								];
								return {
									...acc,
									[rubric.idAttribute]: {
										...rubric,
										idMas: rubric.idAttribute,
										documents: rubric.idAttribute === 'S.3.1' ? documents : [],
									},
								};
							}, {}),
						},
					});
				}
			);
		},

		err => {
			dispatch({
				type: A.LOAD_OPERATIONS_SIMS_LIST_FAILURE,
				payload: { err },
			});
		}
	);
};
