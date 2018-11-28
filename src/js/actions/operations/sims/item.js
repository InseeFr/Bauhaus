import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export const saveSims = (sims, callback) => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_SIMS,
		payload: sims,
	});
	const method = sims.id ? 'putSims' : 'postSims';

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
};

export default id => dispatch => {
	if (!id) {
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
			dispatch({
				type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
				payload: {
					...results,
					rubrics: results.rubrics.reduce((acc, rubric) => {
						return {
							...acc,
							[rubric.idAttribute.toLowerCase()]: {
								...rubric,
								idMas: rubric.idAttribute.toLowerCase(),
							},
						};
					}, {}),
				},
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
