import { describe, it, expect } from 'vitest';

import { DATASET_CONTRIBUTOR } from '../../auth/roles';
import { Dataset } from '../../model/Dataset';
import { Permission } from '../../redux/selectors';
import { checkIfContributorContainsUserStamp } from './check-stamp-with-contributor';

describe('checkIfContributorContainsUserStamp', () => {
	it('should return true if the user stamp is in contributors and the role is correct', () => {
		const dataset: Dataset = {
			catalogRecord: {
				contributor: ['userStamp1', 'userStamp2'],
			},
		} as Dataset;
		const permission: Permission = {
			stamp: 'userStamp1',
			roles: [DATASET_CONTRIBUTOR],
		} as Permission;

		expect(checkIfContributorContainsUserStamp(dataset, permission)).toBe(true);
	});

	it('should return false if the user stamp is not in contributors', () => {
		const dataset: Dataset = {
			catalogRecord: {
				contributor: ['userStamp2', 'userStamp3'],
			},
		} as Dataset;
		const permission: Permission = {
			stamp: 'userStamp1',
			roles: [DATASET_CONTRIBUTOR],
		} as Permission;

		expect(checkIfContributorContainsUserStamp(dataset, permission)).toBe(
			false,
		);
	});

	it('should return false if the user role does not include DATASET_CONTRIBUTOR', () => {
		const dataset: Dataset = {
			catalogRecord: {
				contributor: ['userStamp1', 'userStamp2'],
			},
		} as Dataset;
		const permission: Permission = {
			stamp: 'userStamp1',
			roles: ['ANOTHER_ROLE'],
		} as Permission;

		expect(checkIfContributorContainsUserStamp(dataset, permission)).toBe(
			false,
		);
	});

	it('should correctly handle a single non-array contributor', () => {
		const dataset: Dataset = {
			catalogRecord: {
				contributor: 'userStamp1',
			},
		} as Dataset;
		const permission: Permission = {
			stamp: 'userStamp1',
			roles: [DATASET_CONTRIBUTOR],
		} as Permission;

		expect(checkIfContributorContainsUserStamp(dataset, permission)).toBe(true);
	});

	it('should return false if the dataset or permission is undefined', () => {
		expect(
			checkIfContributorContainsUserStamp(
				undefined as unknown as Dataset,
				undefined as unknown as Permission,
			),
		).toBe(false);
	});
});
