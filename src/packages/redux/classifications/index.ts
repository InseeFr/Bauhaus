import classificationGeneral from './classification/general';
import classificationLevels from './classification/levels';
import classificationsCorrespondenceAssociation from './correspondence/association';
import classificationsCorrespondenceAssociations from './correspondence/associations';
import classificationsCorrespondenceGeneral from './correspondence/general';
import classificationLevelGeneral from './level/general';
import classificationLevelMembers from './level/members';

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
