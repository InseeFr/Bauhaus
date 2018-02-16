import conceptGeneral from './by-id/general';
import conceptNotes from './by-id/notes';
import conceptLinks from './by-id/links';
import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';
import { handleReset } from 'js/reducers/utils/reset-reducer';

const conceptList = handleReset(
	listReducer([
		A.LOAD_CONCEPT_LIST,
		A.LOAD_CONCEPT_LIST_SUCCESS,
		A.LOAD_CONCEPT_LIST_FAILURE,
	]),
	[A.CREATE_CONCEPT, A.UPDATE_CONCEPT]
);

const conceptToValidateList = handleReset(
	listReducer([
		A.LOAD_CONCEPT_VALIDATE_LIST,
		A.LOAD_CONCEPT_VALIDATE_LIST_SUCCESS,
		A.LOAD_CONCEPT_VALIDATE_LIST_FAILURE,
	]),
	[A.CREATE_CONCEPT, A.UPDATE_CONCEPT, A.VALIDATE_CONCEPT_LIST]
);

const conceptSearchList = handleReset(
	listReducer([
		A.LOAD_CONCEPT_SEARCH_LIST,
		A.LOAD_CONCEPT_SEARCH_LIST_SUCCESS,
		A.LOAD_CONCEPT_SEARCH_LIST_FAILURE,
	]),
	[A.CREATE_CONCEPT, A.UPDATE_CONCEPT, A.VALIDATE_CONCEPT_LIST]
);

export default {
	conceptList,
	conceptSearchList,
	conceptToValidateList,
	conceptGeneral,
	conceptNotes,
	conceptLinks,
};
