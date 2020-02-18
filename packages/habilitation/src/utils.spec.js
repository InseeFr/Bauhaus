import * as A from './utils';

import { arrayDifferenceByID } from '@inseefr/wilco';

jest.mock('@inseefr/wilco', () => {
	return {
		arrayDifferenceByID: jest.fn().mockReturnValue([]),
	};
});
describe('extractAdded', () => {
	beforeEach(() => {
		arrayDifferenceByID.mockClear();
	});
	it('should return an empty array', () => {
		expect(A.extractAdded([], [])).toEqual([]);
	});
	it('should return an empty array', () => {
		A.extractAdded(
			[{ id: 'id1', label: 'label 1', isAdded: false }],
			[{ id: 'id1', label: 'label 1', isAdded: true }]
		);
		expect(arrayDifferenceByID).toHaveBeenCalledWith(
			[],
			[{ id: 'id1', label: 'label 1', isAdded: true }]
		);
	});
	it('should return different array', () => {
		A.extractAdded(
			[
				{ id: 'id1', label: 'label 1', isAdded: true },
				{ id: 'id2', label: 'label 2', isAdded: true },
			],
			[{ id: 'id1', label: 'label 1', isAdded: true }]
		);
		expect(arrayDifferenceByID).toHaveBeenCalledWith(
			[
				{ id: 'id1', label: 'label 1', isAdded: true },
				{ id: 'id2', label: 'label 2', isAdded: true },
			],
			[{ id: 'id1', label: 'label 1', isAdded: true }]
		);
	});
});

describe('extractDeleted', () => {
	beforeEach(() => {
		arrayDifferenceByID.mockClear();
	});
	it('should return an empty array', () => {
		expect(A.extractDeleted([], [])).toEqual([]);
	});
	it('should return an empty array', () => {
		A.extractDeleted(
			[{ id: 'id1', label: 'label 1', isAdded: true }],
			[{ id: 'id1', label: 'label 1', isAdded: false }]
		);

		expect(arrayDifferenceByID).toHaveBeenCalledWith(
			[],
			[{ id: 'id1', label: 'label 1', isAdded: true }]
		);
	});
	it('should return different array', () => {
		A.extractDeleted(
			[{ id: 'id1', label: 'label 1', isAdded: true }],
			[
				{ id: 'id1', label: 'label 1', isAdded: true },
				{ id: 'id2', label: 'label 2', isAdded: false },
			]
		);
		expect(arrayDifferenceByID).toHaveBeenCalledWith(
			[{ id: 'id1', label: 'label 1', isAdded: true }],
			[{ id: 'id1', label: 'label 1', isAdded: true }]
		);
	});
});

describe('buildAgents', () => {
	it('should return an empty array', () => {
		expect(A.buildAgents([], [], '')).toEqual([]);
	});
	it('should return agent array', () => {
		expect(A.buildAgents([], [], '')).toEqual([]);
	});
});

describe('buildDataToAdd', () => {
	it('should return an empty array', () => {
		expect(A.buildDataToAdd([])).toEqual([]);
	});
	it('should return an array', () => {
		expect(
			A.buildDataToAdd({ admin: [{ id: 'id1', label: 'label 1' }] })
		).toEqual([{ roles: ['admin'], id: 'id1' }]);
	});
	it('should return an array', () => {
		expect(
			A.buildDataToAdd({
				admin: [{ id: 'id1', label: 'label 1' }],
				guest: [
					{ id: 'id1', label: 'label 1' },
					{ id: 'id2', label: 'label 2' },
				],
			})
		).toEqual([
			{ roles: ['admin', 'guest'], id: 'id1' },
			{ roles: ['guest'], id: 'id2' },
		]);
	});
});

describe('buildDataToDelete', () => {
	it('should return an empty array', () => {
		expect(A.buildDataToDelete([])).toEqual([]);
	});
	it('should return an array', () => {
		expect(
			A.buildDataToDelete({ admin: [{ id: 'id1', label: 'label 1' }] })
		).toEqual([{ role: 'admin', id: 'id1' }]);
	});
	it('should return an array', () => {
		expect(
			A.buildDataToDelete({
				admin: [{ id: 'id1', label: 'label 1' }],
				guest: [{ id: 'id1', label: 'label 1' }],
			})
		).toEqual([
			{ role: 'admin', id: 'id1' },
			{ role: 'guest', id: 'id1' },
		]);
	});
});

describe('buildDataToSave', () => {
	it('should return an object with empty attributs', () => {
		expect(A.buildDataToSave([], [])).toEqual({ toAdd: [], toDelete: [] });
	});
	it('should return an object with attributs', () => {
		expect(
			A.buildDataToSave(
				{ admin: [{ id: 'id1', label: 'label 1' }] },
				{ guest: [{ id: 'id1', label: 'label 1' }] }
			)
		).toEqual({
			toAdd: [{ roles: ['admin'], id: 'id1' }],
			toDelete: [{ role: 'guest', id: 'id1' }],
		});
	});
});
