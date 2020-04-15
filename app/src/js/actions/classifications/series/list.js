import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';
import { ArrayUtils } from 'bauhaus-utilities';

export default () => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATIONS_SERIES_LIST,
		payload: {},
	});
	return api.getSeriesList().then(
		results =>
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_SERIES_LIST_SUCCESS,
				payload: { results: ArrayUtils.sortArrayByLabel(results) },
			}),
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_SERIES_LIST_FAILURE,
				payload: { err },
			})
	);
};
