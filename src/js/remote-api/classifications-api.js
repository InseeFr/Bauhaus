import { baseHostClassification } from 'config';
import buildApi from './build-api';

const api = {
	getFamiliesList: () => ['families'],
	getSeriesList: () => ['series'],
	getList: () => [''],
	getCorrespondencesList: () => ['correspondences'],
	getFamilyGeneral: id => [`family/${id}`],
	getFamilyMembers: id => [`family/${id}/members`],
	getSeriesGeneral: id => [`series/${id}`],
	getSeriesMembers: id => [`series/${id}/members`],
	getClassificationGeneral: id => [`classification/${id}`],
	getClassificationItems: id => [`classification/${id}/items`],
	getClassificationLevels: id => [`classification/${id}/levels`],
	getClassificationLevelGeneral: (classificationId, levelId) => [
		`classification/${classificationId}/level/${levelId}`,
	],
	getClassificationLevelMembers: (classificationId, levelId) => [
		`classification/${classificationId}/level/${levelId}/members`,
	],
	getClassificationItemGeneral: (classificationId, itemId) => [
		`classification/${classificationId}/item/${itemId}`,
	],
	getClassificationItemNotes: (classificationId, itemId, conceptVersion) => [
		`classification/${classificationId}/item/${itemId}/notes/${conceptVersion}`,
	],
	getClassificationItemNarrowers: (classificationId, itemId) => [
		`classification/${classificationId}/item/${itemId}/narrowers`,
	],
	getCorrespondenceGeneral: correspondenceId => [
		`correspondence/${correspondenceId}`,
	],
	getCorrespondenceAssociations: correspondenceId => [
		`correspondence/${correspondenceId}/associations`,
	],
};

export default buildApi(baseHostClassification, api);
