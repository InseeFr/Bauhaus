import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export const saveSerie = (series, callback) => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_SERIE,
		payload: series,
	});
	const method = series.id ? 'putSeries' : 'postSeries';
	return api[method](series).then(
		id => {
			dispatch({
				type: A.SAVE_OPERATIONS_SERIE_SUCCESS,
				payload: {
					...series,
					id,
				},
			});
			callback(id);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_SERIE_FAILURE,
				payload: { err },
			});
			callback();
		}
	);
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
				payload: results,
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_SERIES_LIST_FAILURE,
				payload: { err },
			})
	);
};
