import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';
import classificationFamilyGeneral from './family/general';
import classificationFamilyMembers from './family/members';
import classificationSeriesGeneral from './series/general';
import classificationSeriesMembers from './series/members';
import classificationGeneral from './classification/general';
import classificationTree from './tree';
import classificationLevels from './classification/levels';
import classificationLevelGeneral from './level/general';
import classificationLevelMembers from './level/members';
import classificationItemGeneral from './item/general';
import classificationItemNotes from './item/notes';
import classificationItemNarrowers from './item/narrowers';

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

const classificationsList = listReducer([
	A.LOAD_CLASSIFICATIONS_LIST,
	A.LOAD_CLASSIFICATIONS_LIST_SUCCESS,
	A.LOAD_CLASSIFICATIONS_LIST_FAILURE,
]);

export default {
	classificationsFamiliesList,
	classificationsSeriesList,
	classificationsList,
	classificationFamilyGeneral,
	classificationFamilyMembers,
	classificationSeriesGeneral,
	classificationSeriesMembers,
	classificationGeneral,
	classificationTree,
	classificationLevels,
	classificationLevelGeneral,
	classificationLevelMembers,
	classificationItemGeneral,
	classificationItemNotes,
	classificationItemNarrowers,
};
