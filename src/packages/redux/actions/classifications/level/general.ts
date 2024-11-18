import { Dispatch } from 'redux';
import * as A from '../../../../redux/actions/constants';
import { ClassificationsApi } from '@sdk/classification';

const fetchClassificationLevelGeneral =
	(classificationId: string, levelId: string) => (dispatch: Dispatch) => {
		dispatch({
			type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL,
			payload: {
				classificationId,
				levelId,
			},
		});
		return ClassificationsApi.getClassificationLevelGeneral(
			classificationId,
			levelId,
		).then(
			(results: any) => {
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
			(err: any) =>
				dispatch({
					type: A.LOAD_CLASSIFICATION_LEVEL_GENERAL_FAILURE,
					payload: {
						err,
						classificationId,
						levelId,
					},
				}),
		);
	};

export default fetchClassificationLevelGeneral;
