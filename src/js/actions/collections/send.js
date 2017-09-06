import api from 'js/remote-api/api';
import * as A from '../constants';

export default (id, mailInfo) => dispatch => {
	dispatch({
		type: A.SEND_COLLECTION,
		payload: {
			mailInfo,
		},
	});
	return api.postCollectionSend(id, mailInfo).then(
		id =>
			dispatch({ type: A.SEND_COLLECTION_SUCCESS, payload: { id, mailInfo } }),
		err =>
			dispatch({
				type: A.SEND_COLLECTION_FAILURE,
				payload: { err, id, mailInfo },
			})
	);
};
