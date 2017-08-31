import api from 'js/remote-api/api';
import * as A from '../constants';

export default ids => dispatch => {
	dispatch({
		type: A.VALIDATE_COLLECTION_LIST,
		payload: {
			ids,
		},
	});
	return api.putCollectionValidList(ids).then(
		res =>
			dispatch({
				type: A.VALIDATE_COLLECTION_LIST_SUCCESS,
				payload: { ids },
			}),
		err =>
			dispatch({
				type: A.VALIDATE_COLLECTION_LIST_FAILURE,
				payload: { err, ids },
			})
	);
};
