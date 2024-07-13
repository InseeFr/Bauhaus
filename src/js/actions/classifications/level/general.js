import api from '../../../remote-api/classifications-api';
import * as A from '../../../actions/constants';

const fetchClassificationLevelGeneral =
	(classificationId, levelId) => (dispatch) => {
		dispatch({
			type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL,
			payload: {
				classificationId,
				levelId,
			},
		});
		return api.getClassificationLevelGeneral(classificationId, levelId).then(
			(results) => {
				dispatch({
					type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS,
					payload: {
						classificationId,
						levelId,
						results,
					},
				});
				return results;
			},
			(err) =>
				dispatch({
					type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL_FAILURE,
					payload: {
						err,
						classificationId,
						levelId,
					},
				})
		);
	};

export default fetchClassificationLevelGeneral;
