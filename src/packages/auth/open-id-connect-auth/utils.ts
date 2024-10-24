import * as R from '../../auth/roles';
import { Collection } from '../../model/concepts/collection';
import { Concept } from '../../model/concepts/concept';

export const isAdmin = (roles: string[]) => roles.includes(R.ADMIN);

export const isContributor = (
	roles: string[],
	stamp: string,
	conceptCreator: string,
) => {
	return (
		roles.includes(R.CONCEPTS_CONTRIBUTOR) ||
		(roles.includes(R.CONCEPT_CONTRIBUTOR) && stamp === conceptCreator)
	);
};
export const isConceptCreator = (
	roles: string[],
	stamp: string,
	conceptCreator: string,
) => roles.includes(R.CONCEPTS_CREATOR) && stamp === conceptCreator;

export const filterConceptsToValidate = (
	concepts: Concept[],
	roles: string[],
	stamp: string,
) =>
	!roles.includes(R.CONCEPTS_CREATOR)
		? concepts
		: concepts.filter((c) => c.creator === stamp);

export const isCollectionCreator = (
	roles: string[],
	stamp?: string,
	collectionCreator?: string,
) => roles.includes(R.COLLECTIONS_CREATOR) && stamp === collectionCreator;

export const filterCollectionsToValidate = (
	collections: Collection[],
	roles: string[],
	stamp: string,
) =>
	!roles.includes(R.COLLECTIONS_CREATOR)
		? collections
		: collections.filter((c) => c.creator === stamp);

export const isAdminOrContributor = (roles: string[]) =>
	isAdmin(roles) || roles.includes(R.CONCEPTS_CONTRIBUTOR);

export const isAdminOrConceptCreator = (
	roles: string[],
	stamp: string,
	conceptCreator: string,
) => isAdmin(roles) || isConceptCreator(roles, stamp, conceptCreator);

export const isAdminOrContributorOrConceptCreator = (
	roles: string[],
	stamp: string,
	conceptCreator: string,
) =>
	isAdminOrContributor(roles) || isConceptCreator(roles, stamp, conceptCreator);

export const isAdminOrCollectionCreator = (
	roles: string[],
	stamp?: string,
	collectionCreator?: string,
) => isAdmin(roles) || isCollectionCreator(roles, stamp, collectionCreator);
