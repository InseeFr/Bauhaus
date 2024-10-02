import * as A from '../../actions/constants';
import { ClassificationsApi } from '../../../sdk/classification';

const loadClassificationLevels = (id: string) => (dispatch: any) => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_LEVELS,
		payload: {
			id,
		},
	});
	return ClassificationsApi.getClassificationLevels(id).then(
		(results: any) => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_LEVELS_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		(err: any) =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_LEVELS_FAILURE,
				payload: { err, id },
			}),
	);
};

export default loadClassificationLevels;
