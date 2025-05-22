import { Dataset } from '../../model/Dataset';

export const getContributors = (dataset: Dataset) => {
	return Array.isArray(dataset?.catalogRecord?.contributor)
		? dataset?.catalogRecord?.contributor
		: [dataset?.catalogRecord?.contributor];
};
