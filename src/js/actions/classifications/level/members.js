import * as A from '../../../actions/constants';
import { ClassificationsApi } from '../../../new-architecture/sdk/classification';

const fetchClassificationLevelMembers =
	(classificationId, levelId) => (dispatch) => {
		dispatch({
			type: A.LOAD_CLASSIFICATION_LEVEL_MEMBERS,
			payload: {
				classificationId,
				levelId,
			},
		});
		return ClassificationsApi.getClassificationLevelMembers(
			classificationId,
			levelId
		).then(
			(results) => {
				dispatch({
					type: A.LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS,
					payload: { classificationId, levelId, results },
				});
				return results;
			},
			(err) =>
				dispatch({
					type: A.LOAD_CLASSIFICATION_LEVEL_MEMBERS_FAILURE,
					payload: { err, classificationId, levelId },
				})
		);
	};
export default fetchClassificationLevelMembers;
