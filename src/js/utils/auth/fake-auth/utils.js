import * as roles from 'js/utils/auth/roles';

export const isAdmin = role => role === roles.ADMIN;

export const isContributor = role => role === roles.CONCEPTS_CONTRIBUTOR;

export const isConceptCreator = role => role === roles.CONCEPTS_CREATOR;

export const isCollectionCreator = role => role === roles.COLLECTIONS_CREATOR;

export const isAdminOrContributor = role =>
	role === roles.ADMIN || role === roles.CONCEPTS_CONTRIBUTOR;

export const isAdminOrConceptCreator = role =>
	role === roles.ADMIN || role === roles.CONCEPTS_CREATOR;

export const isAdminOrCollectionCreator = role =>
	role === roles.COLLECTIONS_CREATOR;
