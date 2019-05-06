import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import { LOADING } from 'js/constants';
import { getLabelsFromOperation } from 'js/utils/msd';

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

export const saveSims = (sims, callback) => (dispatch, getState) => {
	let promise = Promise.resolve(sims);

	if (!sims.labelLg1 && sims.idOperation) {
		promise = api.getOperation(sims.idOperation).then(result => {
			return {
				...sims,
				...getLabelsFromOperation(result),
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
							operationsWithoutSims,
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
