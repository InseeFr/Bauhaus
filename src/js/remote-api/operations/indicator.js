import { generateGenericApiEndpoints } from '../../new-architecture/utils/build-api';

const api = {
	...generateGenericApiEndpoints('indicators', 'indicator'),
	getIndicatorsListWithSims: () => ['indicators/withSims'],
};

export default api;
