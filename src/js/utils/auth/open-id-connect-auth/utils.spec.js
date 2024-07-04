import * as R from '../roles';
import * as U from './utils';

const emptyRole = [];
const fullRoles = [
	R.ADMIN,
	R.CONCEPTS_CONTRIBUTOR,
	R.CONCEPTS_CREATOR,
	R.COLLECTIONS_CREATOR,
];
const items = [{ creator: 'creator' }, { creator: 'creator2' }];

describe('open-id-connect-auth-utils', () => {
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
		it('should return false because of stamps', () => {
			expect(U.isConceptCreator(fullRoles, 'stamp', 'other stamp')).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isConceptCreator(fullRoles, 'stamp', 'stamp')).toBeTruthy();
		});
	});
	describe('filterConceptsToValidate', () => {
		it('should return items', () => {
			expect(U.filterConceptsToValidate(items, emptyRole, 'creator')).toEqual(
				items
			);
		});
		it('should return empty array', () => {
			expect(
				U.filterConceptsToValidate(items, fullRoles, 'creatorXXX')
			).toEqual([]);
		});
		it('should return filtered array', () => {
			expect(U.filterConceptsToValidate(items, fullRoles, 'creator')).toEqual([
				{ creator: 'creator' },
			]);
		});
	});
	describe('isCollectionCreator', () => {
		it('should return false', () => {
			expect(U.isCollectionCreator(emptyRole)).toBeFalsy();
		});
		it('should return false because of stamps', () => {
			expect(
				U.isCollectionCreator(fullRoles, 'stamp', 'other stamp')
			).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isCollectionCreator(fullRoles, 'stamp', 'stamp')).toBeTruthy();
		});
	});
	describe('filterCollectionsToValidate', () => {
		it('should return items', () => {
			expect(
				U.filterCollectionsToValidate(items, emptyRole, 'creator')
			).toEqual(items);
		});
		it('should return empty array', () => {
			expect(
				U.filterCollectionsToValidate(items, fullRoles, 'creatorXXX')
			).toEqual([]);
		});
		it('should return filtered array', () => {
			expect(
				U.filterCollectionsToValidate(items, fullRoles, 'creator')
			).toEqual([{ creator: 'creator' }]);
		});
	});
	describe('isAdminOrContributor', () => {
		it('should return false', () => {
			expect(U.isAdminOrContributor(emptyRole)).toBeFalsy();
		});
		it('should return true', () => {
			expect(U.isAdminOrContributor(fullRoles)).toBeTruthy();
		});
	});
	describe('isAdminOrConceptCreator', () => {
		it('should return false', () => {
			expect(U.isAdminOrConceptCreator(emptyRole)).toBeFalsy();
		});
		it('should return false because of stamps', () => {
			expect(
				U.isAdminOrConceptCreator([R.CONCEPTS_CREATOR], 'stamp', 'stampX')
			).toBeFalsy();
		});
		it('should return true if we pass all roles', () => {
			expect(U.isAdminOrConceptCreator(fullRoles)).toBeTruthy();
		});
		it('should return true if we pass only the CONCEPT_CREATOR role', () => {
			expect(
				U.isAdminOrConceptCreator([R.CONCEPTS_CREATOR], 'stamp', 'stamp')
			).toBeTruthy();
		});
	});
	describe('isAdminOrContributorOrConceptCreator', () => {
		it('should return false', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(emptyRole, 'stamp', 'stamp')
			).toBeFalsy();
		});
		it('should return true if we pass all roles', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(fullRoles, 'stamp', 'stamp')
			).toBeTruthy();
		});
		it('should return true if we pass only the CONCEPT_CREATOR rolee', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(
					[R.CONCEPTS_CONTRIBUTOR],
					'stamp',
					'stamp'
				)
			).toBeTruthy();
		});
		it('should return false because of stamps', () => {
			expect(
				U.isAdminOrContributorOrConceptCreator(
					[R.CONCEPTS_CREATOR],
					'stamp',
					'stampX'
				)
			).toBeFalsy();
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
		it('should return false because of stamps', () => {
			expect(
				U.isAdminOrCollectionCreator([R.COLLECTIONS_CREATOR], 'stamp', 'stampX')
			).toBeFalsy();
		});
		it('should return true if we pass all roles', () => {
			expect(U.isAdminOrCollectionCreator(fullRoles)).toBeTruthy();
		});
		it('should return true if we pass only the COLLECTIONS_CREATOR role', () => {
			expect(
				U.isAdminOrCollectionCreator([R.COLLECTIONS_CREATOR], 'stamp', 'stamp')
			).toBeTruthy();
		});
	});
});
