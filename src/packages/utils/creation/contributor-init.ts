/**
 * For some object (dataset and structure for the moment), if the user
 * is not an admin, we have to initialize the contributor property (during
 * the creation of a new object) with the stamp of the user
 */
export const initializeContributorProperty = (
	isContributor: boolean,
	isCreation: boolean,
	userStamp: string,
): { contributor?: string[] } => {
	if (isContributor && isCreation) {
		return {
			contributor: [userStamp],
		};
	}

	return {};
};
