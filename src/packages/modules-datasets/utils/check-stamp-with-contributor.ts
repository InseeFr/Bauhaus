import { DATASET_CONTRIBUTOR } from '../../auth/roles';
import { Dataset } from '../../model/Dataset';
import { Permission } from '../../redux/selectors';

export const checkIfContributorContainsUserStamp = (
	dataset: Dataset,
	permission: Permission,
) => {
	const contributors = Array.isArray(dataset?.catalogRecord?.contributor)
		? dataset?.catalogRecord?.contributor
		: [dataset?.catalogRecord?.contributor];

	return !!(
		contributors.find((c) => c === permission?.stamp) &&
		permission?.roles?.includes(DATASET_CONTRIBUTOR)
	);
};

export const getContributors = (dataset: Dataset) => {
	return Array.isArray(dataset?.catalogRecord?.contributor)
		? dataset?.catalogRecord?.contributor
		: [dataset?.catalogRecord?.contributor];
};
