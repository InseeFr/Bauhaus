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
};

export default buildApi(baseHostClassification, api);
