import { ClassificationsApi } from '@sdk/classification';

import { sortArray } from '../../utils/array-utils';

export const fetchingPreviousLevels = (classificationId, general) => {
	const levels = ['sections', 'divisions', 'groupes', 'classes', 'categories'];

	if (!general.broaderURI) {
		return Promise.resolve([]);
	}

	const currentLevel = general.broaderURI.substring(
		general.broaderURI.indexOf(classificationId) + classificationId.length + 1,
		general.broaderURI.lastIndexOf('/'),
	);
	const previousLevel =
		levels[levels.findIndex((level) => level.startsWith(currentLevel))];

	if (previousLevel) {
		return ClassificationsApi.getClassificationLevelMembers(
			classificationId,
			previousLevel,
		).then((data) => sortArray('labelLg1')(data));
	}

	return Promise.resolve([]);
};
