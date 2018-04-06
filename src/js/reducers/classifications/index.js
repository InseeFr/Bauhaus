import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';
const classificationsFamiliesList = listReducer([
	A.LOAD_CLASSIFICATIONS_FAMILIES_LIST,
	A.LOAD_CLASSIFICATIONS_FAMILIES_LIST_SUCCESS,
	A.LOAD_CLASSIFICATIONS_FAMILIES_LIST_FAILURE,
]);
