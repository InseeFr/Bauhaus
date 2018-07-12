import * as A from './utils';

describe('administration utils', () => {
	describe('buildAgents', () => {
		it('should return an empty array', () => {
			expect(A.buildAgents([], [], '')).toEqual([]);
		});
		it('should return agent array', () => {
			expect(A.buildAgents([], [], '')).toEqual([]);
		});
	});

	describe('getRoleLabel', () => {
		it('should return an empty string', () => {
			expect(A.getRoleLabel([], '')).toEqual('');
		});
		it('should return label', () => {
			expect(A.getRoleLabel([{ id: 'id1', label: 'label' }], 'id1')).toEqual(
				'label'
			);
		});
	});

	describe('extractAdded', () => {
		it('should return an empty array', () => {
			expect(A.extractAdded([], [])).toEqual([]);
		});
		it('should return empty difference array', () => {
			expect(
				A.extractAdded(
					[{ id: 'id1', label: 'label 1', isAdded: true }],
					[{ id: 'id1', label: 'label 1', isAdded: true }]
				)
			).toEqual([]);
		});
		it('should return difference array', () => {
			expect(
				A.extractAdded(
					[
						{ id: 'id1', label: 'label 1', isAdded: true },
						{ id: 'id2', label: 'label 2', isAdded: true },
					],
					[{ id: 'id1', label: 'label 1', isAdded: true }]
				)
			).toEqual([{ id: 'id2', label: 'label 2', isAdded: true }]);
		});
	});

	describe('extractDeleted', () => {
		it('should return an empty array', () => {
			expect(A.extractDeleted([], [])).toEqual([]);
		});
		it('should return empty difference array', () => {
			expect(
				A.extractDeleted(
					[{ id: 'id1', label: 'label 1', isAdded: true }],
					[{ id: 'id1', label: 'label 1', isAdded: true }]
				)
			).toEqual([]);
		});
		it('should return difference array', () => {
			expect(
				A.extractDeleted(
					[{ id: 'id1', label: 'label 1', isAdded: true }],
					[
						{ id: 'id1', label: 'label 1', isAdded: true },
						{ id: 'id2', label: 'label 2', isAdded: true },
					]
				)
			).toEqual([{ id: 'id2', label: 'label 2', isAdded: true }]);
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
			).toEqual([{ role: 'admin', id: 'id1' }, { role: 'guest', id: 'id1' }]);
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
});
