import { baseHostOperations } from 'config';
import buildApi from './build-api';

const api = {
	getSeriesList: () => ['series'],
};

export default buildApi(baseHostOperations, api);
