import api from '../../remote-api/classifications-api';
import * as A from '../../actions/constants';

const fetchClassificationGeneral = (id) => (dispatch) => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_GENERAL,
		payload: {
			id,
		},
	});
	return api.getClassificationGeneral(id).then(
		(results) => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_GENERAL_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		(err) =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_GENERAL_FAILURE,
				payload: { err, id },
			})
	);
};

export default fetchClassificationGeneral;
