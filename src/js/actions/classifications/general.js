import * as A from '../../actions/constants';
import { ClassificationsApi } from '../../new-architecture/sdk/classification';

const fetchClassificationGeneral = (id) => (dispatch) => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_GENERAL,
		payload: {
			id,
		},
	});
	return ClassificationsApi.getClassificationGeneral(id).then(
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
