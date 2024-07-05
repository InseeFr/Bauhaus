import { generateGenericApiEndpoints } from 'js/new-architecture/utils/build-api';

export default {
	...generateGenericApiEndpoints('indicators', 'indicator'),
	getIndicatorsListWithSims: () => ['indicators/withSims'],
};
