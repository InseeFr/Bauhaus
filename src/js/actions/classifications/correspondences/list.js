import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';
import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

export default () => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATIONS_CORRESPONDENCES_LIST,
		payload: {},
	});
	return api.getCorrespondencesList().then(
		results =>
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_CORRESPONDENCES_LIST_SUCCESS,
				payload: { results: sortByLabel(results) },
			}),
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_CORRESPONDENCES_LIST_FAILURE,
				payload: { err },
			})
	);
};
