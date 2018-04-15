import * as U from './utils';

const emptyRole = [];
const items = [{ creator: 'creator' }, { creator: 'creator2' }];

describe('no-auth-utils', () => {
	describe('isAdmin', () => {
		it('should return true', () => {
			expect(U.isAdmin(emptyRole)).toBeTruthy();
		});
	});
	describe('isContributor', () => {
		it('should return true', () => {
			expect(U.isContributor(emptyRole)).toBeTruthy();
		});
	});
	describe('isConceptCreator', () => {
		it('should return true', () => {
			expect(U.isConceptCreator(emptyRole, 'stamp', 'stamp')).toBeTruthy();
		});
	});
	describe('filterConceptsToValidate', () => {
		it('should return items', () => {
			expect(U.filterConceptsToValidate(items, emptyRole, 'creator')).toEqual(
				items
			);
		});
	});
	describe('isCollectionCreator', () => {
		it('should return true', () => {
			expect(U.isCollectionCreator(emptyRole, 'stamp', 'stamp')).toBeTruthy();
		});
	});
	describe('filterCollectionsToValidate', () => {
		it('should return items', () => {
			expect(
				U.filterCollectionsToValidate(items, emptyRole, 'creator')
			).toEqual(items);
		});
	});
	describe('isAdminOrContributor', () => {
		it('should return true', () => {
			expect(U.isAdminOrContributor(emptyRole)).toBeTruthy();
		});
	});
	describe('isAdminOrConceptCreator', () => {
		it('should return true', () => {
			expect(U.isAdminOrConceptCreator(emptyRole)).toBeTruthy();
		});
	});
	describe('isAdminOrContributorOrConceptCreator', () => {
		it('should return true', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(emptyRole, 'stamp', 'stamp')
			).toBeTruthy();
		});
	});
	describe('isAdminOrCollectionCreator', () => {
		it('should return true', () => {
			expect(U.isAdminOrCollectionCreator(emptyRole)).toBeTruthy();
		});
	});
});
