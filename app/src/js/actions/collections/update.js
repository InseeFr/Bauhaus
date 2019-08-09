import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

export default (id, collection) => dispatch => {
	dispatch({
		type: A.UPDATE_COLLECTION,
		payload: {
			id,
			collection,
		},
	});
	return api.putCollection(id, collection).then(
		res => {
			dispatch({
				type: A.UPDATE_COLLECTION_SUCCESS,
				payload: { id, collection },
			});
		},
		err =>
			dispatch({
				type: A.UPDATE_COLLECTION_FAILURE,
				payload: { err, id, collection },
			})
	);
};
