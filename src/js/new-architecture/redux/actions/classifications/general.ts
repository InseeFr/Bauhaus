import * as A from '../../actions/constants';
import { ClassificationsApi } from '../../../sdk/classification';

const fetchClassificationGeneral = (id: string) => (dispatch: any) => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_GENERAL,
		payload: {
			id,
		},
	});
	return ClassificationsApi.getClassificationGeneral(id).then(
		(results: any) => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_GENERAL_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		(err: any) =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_GENERAL_FAILURE,
				payload: { err, id },
			})
	);
};

export default fetchClassificationGeneral;
