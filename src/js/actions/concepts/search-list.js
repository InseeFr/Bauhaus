import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

const emptyItem = {
	label: '',
	creator: '',
	created: '',
	modifed: '',
	disseminationStatus: '',
	definition: '',
	validationStatus: '',
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
					results: sortByLabel(results).map(concept =>
						Object.assign({}, emptyItem, concept)
					),
				},
			}),
		err =>
			dispatch({ type: A.LOAD_CONCEPT_SEARCH_LIST_FAILURE, payload: { err } })
	);
};
