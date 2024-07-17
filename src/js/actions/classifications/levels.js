import api from '../../remote-api/classifications-api';
import * as A from '../../actions/constants';

const loadClassificationLevels = (id) => (dispatch) => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_LEVELS,
		payload: {
			id,
		},
	});
	return api.getClassificationLevels(id).then(
		(results) => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_LEVELS_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		(err) =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_LEVELS_FAILURE,
				payload: { err, id },
			})
	);
};

export default loadClassificationLevels;
