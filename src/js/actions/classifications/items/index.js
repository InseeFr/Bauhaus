import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_ITEMS,
		payload: {
			id,
		},
	});
	return api.getClassificationItems(id).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEMS_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEMS_FAILURE,
				payload: { err, id },
			})
	);
};
