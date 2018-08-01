import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export const saveSerie = serie => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_SERIE,
		payload: {
			serie,
		},
	});
	dispatch({
		type: A.SAVE_OPERATIONS_SERIE_SUCCESS,
		payload: serie,
	});
	/*return api.saveSerie(serie).then(
		results =>
			dispatch({
				type: A.SAVE_OPERATIONS_SERIE_SUCCESS,
				payload: {
					serie,
				},
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_SERIES_LIST_FAILURE,
				payload: { err },
			})
	);*/
};

export default id => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_SERIE,
		payload: {
			id,
		},
	});
	return api.getSerie(id).then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_SERIE_SUCCESS,
				payload: {
					...results,
					id,
				},
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_SERIES_LIST_FAILURE,
				payload: { err },
			})
	);
};
