import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';
import { ArrayUtils } from 'bauhaus-utilities';

export default () => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_LIST,
		payload: {},
	});
	return api.getCorrespondencesList().then(
		results =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_LIST_SUCCESS,
				payload: { results: ArrayUtils.sortArrayByLabel(results) },
			}),
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_LIST_FAILURE,
				payload: { err },
			})
	);
};
