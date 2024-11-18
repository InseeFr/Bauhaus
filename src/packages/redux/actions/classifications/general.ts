import { Dispatch } from 'redux';

import { ClassificationsApi } from '@sdk/classification';

import * as A from '../../actions/constants';

const fetchClassificationGeneral = (id: string) => (dispatch: Dispatch) => {
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
		(err: string) =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_GENERAL_FAILURE,
				payload: { err, id },
			}),
	);
};

export default fetchClassificationGeneral;
