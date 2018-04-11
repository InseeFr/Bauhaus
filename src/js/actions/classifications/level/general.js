import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default (classificationId, levelId) => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL,
		payload: {
			classificationId,
			levelId,
		},
	});
	return api.getClassificationLevelGeneral(classificationId, levelId).then(
		results => {
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
		err =>
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
