import * as R from 'js/utils/auth/fake-roles';

export const isAdmin = roles => roles.includes(R.ADMIN);

export const isContributor = roles => roles.includes(R.CONCEPTS_CONTRIBUTOR);

export const isConceptCreator = roles => roles.includes(R.CONCEPTS_CREATOR);

export const filterConceptsToValidate = (concepts, roles, stamp) => concepts;

export const isCollectionCreator = roles =>
	roles.includes(R.COLLECTIONS_CREATOR);

export const filterCollectionsToValidate = (collections, roles, stamp) =>
	collections;

export const isAdminOrContributor = roles =>
	roles.includes(R.ADMIN) || roles.includes(R.CONCEPTS_CONTRIBUTOR);

export const isAdminOrConceptCreator = roles =>
	roles.includes(R.ADMIN) || roles.includes(R.CONCEPTS_CREATOR);

export const isAdminOrContributorOrConceptCreator = (
	roles,
	stamp,
	conceptCreator
) =>
	isAdminOrContributor(roles) || isConceptCreator(roles, stamp, conceptCreator);

export const isAdminOrCollectionCreator = roles =>
	roles.includes(R.COLLECTIONS_CREATOR);
