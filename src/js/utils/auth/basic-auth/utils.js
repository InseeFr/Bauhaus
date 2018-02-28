import * as roles from 'js/utils/auth/roles';

export const isAdmin = role => role === roles.ADMIN;

export const isContributor = role => role === roles.CONCEPTS_CONTRIBUTOR;

export const isConceptCreator = (role, stamp, conceptCreator) =>
	role === roles.CONCEPTS_CREATOR && stamp === conceptCreator;

export const filterConceptsToValidate = (concepts, role, stamp) =>
	role !== roles.CONCEPTS_CREATOR
		? concepts
		: concepts.filter(c => c.creator === stamp);

export const isCollectionCreator = (role, stamp, collectionCreator) =>
	role === roles.COLLECTIONS_CREATOR && stamp === collectionCreator;

export const filterCollectionsToValidate = (collections, role, stamp) =>
	role !== roles.COLLECTIONS_CREATOR
		? collections
		: collections.filter(c => c.creator === stamp);

export const isAdminOrContributor = role =>
	role === roles.ADMIN || role === roles.CONCEPTS_CONTRIBUTOR;

export const isAdminOrConceptCreator = role =>
	role === roles.ADMIN || role === roles.CONCEPTS_CREATOR;

export const isAdminOrCollectionCreator = role =>
	role === roles.COLLECTIONS_CREATOR;
