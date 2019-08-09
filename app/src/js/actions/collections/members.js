import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_COLLECTION_MEMBERS,
		payload: {
			id,
		},
	});
	return api.getCollectionMembersList(id).then(
		results => {
			dispatch({
				type: A.LOAD_COLLECTION_MEMBERS_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_COLLECTION_MEMBERS_FAILURE,
				payload: { err, id },
			})
	);
};
