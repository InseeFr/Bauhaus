import api from '../../../remote-api/classifications-api';
import { ArrayUtils } from 'js/utils';

export const fetchingPreviousLevels = (classificationId, general) => {
	const levels = ['sections', 'divisions', 'groupes', 'classes', 'categories'];

	if (!general.broaderURI) {
		return Promise.resolve([]);
	}

	const currentLevel = general.broaderURI.substring(
		general.broaderURI.indexOf(classificationId) + classificationId.length + 1,
		general.broaderURI.lastIndexOf('/')
	);
	const previousLevel =
		levels[levels.findIndex((level) => level.indexOf(currentLevel) === 0)];

	if (!!previousLevel) {
		return api
			.getClassificationLevelMembers(classificationId, previousLevel)
			.then((data) => ArrayUtils.sortArray('labelLg1')(data));
	}

	return Promise.resolve([]);
};
