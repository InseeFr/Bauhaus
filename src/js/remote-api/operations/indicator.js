import { generateGenericApiEndpoints } from '../../new-architecture/sdk';

const api = {
	...generateGenericApiEndpoints('indicators', 'indicator'),
	getIndicatorsListWithSims: () => ['indicators/withSims'],
};

export default api;
