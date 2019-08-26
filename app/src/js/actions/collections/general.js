import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_COLLECTION_GENERAL,
		payload: {
			id,
		},
	});
	return api.getCollectionGeneral(id).then(
		results => {
			dispatch({
				type: A.LOAD_COLLECTION_GENERAL_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_COLLECTION_GENERAL_FAILURE,
				payload: { err, id },
			})
	);
};
