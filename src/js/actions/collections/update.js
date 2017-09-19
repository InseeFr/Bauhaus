import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

//TODO handle the status in the store (for now, we only handle the remote
//call, and a `then` handler in the component take care of adjusting the
//status)
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
