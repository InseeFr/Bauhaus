// TODO
export const isAdmin = roles => true;
export const isContributor = roles => true;
export const isConceptCreator = roles => true;
export const filterConceptsToValidate = (concepts, roles, stamp) => concepts;
export const isCollectionCreator = roles => true;
export const filterCollectionsToValidate = (collections, roles, stamp) =>
	collections;
export const isAdminOrContributor = roles => true;
export const isAdminOrConceptCreator = roles => true;
export const isAdminOrContributorOrConceptCreator = (
	roles,
	stamp,
	conceptCreator
) => true;
export const isAdminOrCollectionCreator = roles => true;
