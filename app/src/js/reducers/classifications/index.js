import listReducer from '../utils/list-reducer';
import * as A from 'js/actions/constants';
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
import classificationsCorrespondenceAssociation from './correspondence/association';

const classificationsCorrespondencesList = listReducer([
	A.LOAD_CLASSIFICATION_CORRESPONDENCE_LIST,
	A.LOAD_CLASSIFICATION_CORRESPONDENCE_LIST_SUCCESS,
	A.LOAD_CLASSIFICATION_CORRESPONDENCE_LIST_FAILURE,
]);

export default {
	classificationsCorrespondencesList,
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
	classificationsCorrespondenceAssociation,
};
