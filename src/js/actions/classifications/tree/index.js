import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_TREE,
		payload: {
			id,
		},
	});
	return api.getClassificationTree(id).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_TREE_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_TREE_FAILURE,
				payload: { err, id },
			})
	);
};
