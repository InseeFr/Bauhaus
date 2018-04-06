import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';
import classificationFamilyGeneral from './family/general';
import classificationFamilyMembers from './family/members';

const classificationsFamiliesList = listReducer([
	A.LOAD_CLASSIFICATIONS_FAMILIES_LIST,
	A.LOAD_CLASSIFICATIONS_FAMILIES_LIST_SUCCESS,
	A.LOAD_CLASSIFICATIONS_FAMILIES_LIST_FAILURE,
]);

const classificationsSeriesList = listReducer([
	A.LOAD_CLASSIFICATIONS_SERIES_LIST,
	A.LOAD_CLASSIFICATIONS_SERIES_LIST_SUCCESS,
	A.LOAD_CLASSIFICATIONS_SERIES_LIST_FAILURE,
]);

export default {
	classificationsFamiliesList,
	classificationsSeriesList,
	classificationsList,
	classificationFamilyGeneral,
	classificationFamilyMembers,
};
