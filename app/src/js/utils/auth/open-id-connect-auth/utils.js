import * as R from 'bauhaus-utilities/src/auth/roles';

export const isAdmin = (roles) => roles.includes(R.ADMIN);

export const isContributor = (roles) => roles.includes(R.CONCEPTS_CONTRIBUTOR);

export const isConceptCreator = (roles, stamp, conceptCreator) =>
	roles.includes(R.CONCEPTS_CREATOR) && stamp === conceptCreator;

export const filterConceptsToValidate = (concepts, roles, stamp) =>
	!roles.includes(R.CONCEPTS_CREATOR)
		? concepts
		: concepts.filter((c) => c.creator === stamp);

export const isCollectionCreator = (roles, stamp, collectionCreator) =>
	roles.includes(R.COLLECTIONS_CREATOR) && stamp === collectionCreator;

export const filterCollectionsToValidate = (collections, roles, stamp) =>
	!roles.includes(R.COLLECTIONS_CREATOR)
		? collections
		: collections.filter((c) => c.creator === stamp);

export const isAdminOrContributor = (roles) =>
	isAdmin(roles) || roles.includes(R.CONCEPTS_CONTRIBUTOR);

export const isAdminOrConceptCreator = (roles, stamp, conceptCreator) =>
	isAdmin(roles) || isConceptCreator(roles, stamp, conceptCreator);

export const isAdminOrContributorOrConceptCreator = (
	roles,
	stamp,
	conceptCreator
) =>
	isAdminOrContributor(roles) || isConceptCreator(roles, stamp, conceptCreator);

export const isAdminOrCollectionCreator = (roles, stamp, collectionCreator) =>
	isAdmin(roles) || isCollectionCreator(roles, stamp, collectionCreator);
