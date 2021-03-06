import api from 'js/remote-api/concepts-api';
import * as A from '../constants';
import { ArrayUtils } from 'bauhaus-utilities';

export default () => dispatch => {
	dispatch({
		type: A.LOAD_COLLECTION_VALIDATE_LIST,
		payload: {},
	});
	return api.getCollectionValidateList().then(
		results =>
			dispatch({
				type: A.LOAD_COLLECTION_VALIDATE_LIST_SUCCESS,
				payload: { results: ArrayUtils.sortArrayByLabel(results) },
			}),
		err =>
			dispatch({
				type: A.LOAD_COLLECTION_VALIDATE_LIST_FAILURE,
				payload: { err },
			})
	);
};
