import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import { getPublishFactory, getItemFactory } from '../utils';

export const publishSeries = getPublishFactory(
	api.publishSeries,
	A.PUBLISH_OPERATIONS_SERIES,
	A.PUBLISH_OPERATIONS_SERIES_SUCCESS,
	A.PUBLISH_OPERATIONS_SERIES_FAILURE
);

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
			callback(null, id);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_SERIE_FAILURE,
				payload: { err },
			});
			callback(err);
		}
	);
};

export default getItemFactory(
	api.getSerie,
	A.LOAD_OPERATIONS_SERIE,
	A.LOAD_OPERATIONS_SERIE_SUCCESS,
	A.LOAD_OPERATIONS_SERIES_LIST_FAILURE
);
