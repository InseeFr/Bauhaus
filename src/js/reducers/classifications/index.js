import classificationGeneral from './classification/general';
import classificationLevels from './classification/levels';
import classificationLevelGeneral from './level/general';
import classificationLevelMembers from './level/members';
import classificationsCorrespondenceGeneral from './correspondence/general';
import classificationsCorrespondenceAssociations from './correspondence/associations';
import classificationsCorrespondenceAssociation from './correspondence/association';

const reducers = {
	classificationGeneral,
	classificationLevels,
	classificationLevelGeneral,
	classificationLevelMembers,
	classificationsCorrespondenceGeneral,
	classificationsCorrespondenceAssociations,
	classificationsCorrespondenceAssociation,
};

export default reducers;
