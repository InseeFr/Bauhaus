import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';
import classificationFamilyGeneral from './family/general';
import classificationFamilyMembers from './family/members';
import classificationSeriesGeneral from './series/general';
import classificationSeriesMembers from './series/members';
import classificationGeneral from './classification/general';
import classificationItems from './items';
import classificationLevels from './classification/levels';
import classificationLevelGeneral from './level/general';
import classificationLevelMembers from './level/members';
import classificationItemGeneral from './item/general';
import classificationItemNotes from './item/notes';
import classificationItemNarrowers from './item/narrowers';
import classificationsCorrespondenceGeneral from './correspondence/general';
import classificationsCorrespondenceAssociations from './correspondence/associations';

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

const classificationsCorrespondencesList = listReducer([
	A.LOAD_CLASSIFICATIONS_CORRESPONDENCES_LIST,
	A.LOAD_CLASSIFICATIONS_CORRESPONDENCES_LIST_SUCCESS,
	A.LOAD_CLASSIFICATIONS_CORRESPONDENCES_LIST_FAILURE,
]);

export default {
	classificationsFamiliesList,
	classificationsSeriesList,
	classificationsList,
	classificationsCorrespondencesList,
	classificationFamilyGeneral,
	classificationFamilyMembers,
	classificationSeriesGeneral,
	classificationSeriesMembers,
	classificationGeneral,
	classificationItems,
	classificationLevels,
	classificationLevelGeneral,
	classificationLevelMembers,
	classificationItemGeneral,
	classificationItemNotes,
	classificationItemNarrowers,
	classificationsCorrespondenceGeneral,
	classificationsCorrespondenceAssociations,
};
