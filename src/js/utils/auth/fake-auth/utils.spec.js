import * as R from 'js/utils/auth/fake-roles';
import * as U from './utils';

const emptyRole = [];
const fullRoles = [
	R.ADMIN,
	R.CONCEPTS_CONTRIBUTOR,
	R.CONCEPTS_CREATOR,
	R.COLLECTIONS_CREATOR,
];
const items = [{ creator: 'creator' }, { creator: 'creator2' }];

describe('fake-auth-utils', () => {
	describe('isAdmin', () => {
		it('should return false', () => {
			expect(U.isAdmin(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isAdmin(fullRoles)).toBeTruthy();
		});
	});
	describe('isContributor', () => {
		it('should return false', () => {
			expect(U.isContributor(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isContributor(fullRoles)).toBeTruthy();
		});
	});
	describe('isConceptCreator', () => {
		it('should return false', () => {
			expect(U.isConceptCreator(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isConceptCreator(fullRoles)).toBeTruthy();
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
		it('should return false', () => {
			expect(U.isCollectionCreator(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isCollectionCreator(fullRoles)).toBeTruthy();
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
		it('should return false', () => {
			expect(U.isAdminOrContributor(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isAdminOrContributor([R.CONCEPTS_CONTRIBUTOR])).toBeTruthy();
		});
		it('should return true', () => {
			expect(U.isAdminOrContributor(fullRoles)).toBeTruthy();
		});
	});
	describe('isAdminOrConceptCreator', () => {
		it('should return false', () => {
			expect(U.isAdminOrConceptCreator(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isAdminOrConceptCreator([R.CONCEPTS_CREATOR])).toBeTruthy();
		});
		it('should return true', () => {
			expect(U.isAdminOrConceptCreator(fullRoles)).toBeTruthy();
		});
	});
	describe('isAdminOrContributorOrConceptCreator', () => {
		it('should return false', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(emptyRole, 'stamp', 'stamp')
			).toBeFalsy();
		});
		it('should return true', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(fullRoles, 'stamp', 'stamp')
			).toBeTruthy();
		});
		it('should return true', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(
					[R.CONCEPTS_CONTRIBUTOR],
					'stamp',
					'stamp'
				)
			).toBeTruthy();
		});
		it('should return true', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(
					[R.CONCEPTS_CREATOR],
					'stamp',
					'stamp'
				)
			).toBeTruthy();
		});
	});
	describe('isAdminOrCollectionCreator', () => {
		it('should return false', () => {
			expect(U.isAdminOrCollectionCreator(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(
				U.isAdminOrCollectionCreator([R.COLLECTIONS_CREATOR])
			).toBeTruthy();
		});
		it('should return true', () => {
			expect(U.isAdminOrCollectionCreator(fullRoles)).toBeTruthy();
		});
	});
});
