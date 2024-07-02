import { generateGenericApiEndpoints } from '../../utils/apis/build-api';

export default {
	...generateGenericApiEndpoints('indicators', 'indicator'),
	getIndicatorsListWithSims: () => ['indicators/withSims'],
};
