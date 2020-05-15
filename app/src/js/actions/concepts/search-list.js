import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

import { ArrayUtils } from 'bauhaus-utilities';

const emptyItem = {
	id: '',
	label: '',
	created: '',
	modified: '',
	disseminationStatus: '',
	validationStatus: '',
	definition: '',
	creator: '',
	isTopConceptOf: '',
	valid: '',
};

export default () => dispatch => {
	dispatch({
		type: A.LOAD_CONCEPT_SEARCH_LIST,
		payload: {},
	});
	return api.getConceptSearchList().then(
		results =>
			dispatch({
				type: A.LOAD_CONCEPT_SEARCH_LIST_SUCCESS,
				payload: {
					results: ArrayUtils.sortArrayByLabel(results).map(concept =>
						Object.assign({}, emptyItem, concept)
					),
				},
			}),
		err =>
			dispatch({ type: A.LOAD_CONCEPT_SEARCH_LIST_FAILURE, payload: { err } })
	);
};
