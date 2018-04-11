import { baseHostClassification } from 'config';
import buildApi from './build-api';

const api = {
	getFamiliesList: () => ['families'],
	getSeriesList: () => ['series'],
	getList: () => [''],
	getFamilyGeneral: id => [`family/${id}`],
	getFamilyMembers: id => [`family/${id}/members`],
	getSeriesGeneral: id => [`series/${id}`],
	getSeriesMembers: id => [`series/${id}/members`],
	getClassificationGeneral: id => [`classification/${id}`],
	getClassificationLevels: id => [`classification/${id}/levels`],
	getClassificationLevelGeneral: (classificationId, levelId) => [
		`classification/${classificationId}/level/${levelId}`,
	],
	getClassificationLevelMembers: (classificationId, levelId) => [
		`classification/${classificationId}/level/${levelId}/members`,
	],
};

export default buildApi(baseHostClassification, api);
