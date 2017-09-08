import api from 'js/remote-api/api';
import * as A from '../constants';

export default collection => dispatch => {
	dispatch({
		type: A.CREATE_COLLECTION,
		payload: {
			collection,
		},
	});
	return api.postCollection(collection).then(
		id =>
			dispatch({
				type: A.CREATE_COLLECTION_SUCCESS,
				payload: { id, collection },
			}),
		err =>
			dispatch({
				type: A.CREATE_COLLECTION_FAILURE,
				payload: { err, collection },
			})
	);
};
