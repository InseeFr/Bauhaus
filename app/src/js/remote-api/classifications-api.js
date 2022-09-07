import { API } from 'bauhaus-utilities';

const api = {
	getFamiliesList: () => ['families'],
	getSeriesList: () => ['series'],
	getList: () => [''],
	getCorrespondencesList: () => ['correspondences'],
	getFamilyGeneral: (id) => [`family/${id}`],
	getFamilyMembers: (id) => [`family/${id}/members`],
	getSeriesGeneral: (id) => [`series/${id}`],
	getSeriesMembers: (id) => [`series/${id}/members`],
	getClassificationGeneral: (id) => [`classification/${id}`],
	getClassificationItems: (id) => [`classification/${id}/items`],
	getClassificationLevels: (id) => [`classification/${id}/levels`],
	getClassificationLevelGeneral: (classificationId, levelId) => [
		`classification/${classificationId}/level/${levelId}`,
	],
	getClassificationLevelMembers: (classificationId, levelId) => [
		`classification/${classificationId}/level/${levelId}/members`,
	],
	getClassificationItemGeneral: (classificationId, itemId) => [
		`classification/${classificationId}/item/${itemId}`,
	],
	putClassificationItemGeneral: (classificationId, itemId, item) => [
		`classification/${classificationId}/item/${itemId}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(item),
		},
		() => Promise.resolve(item.id)
	],
	getClassificationItemNotes: (classificationId, itemId, conceptVersion) => [
		`classification/${classificationId}/item/${itemId}/notes/${conceptVersion}`,
	],
	getClassificationItemNarrowers: (classificationId, itemId) => [
		`classification/${classificationId}/item/${itemId}/narrowers`,
	],
	getCorrespondenceGeneral: (correspondenceId) => [
		`correspondence/${correspondenceId}`,
	],
	getCorrespondenceAssociations: (correspondenceId) => [
		`correspondence/${correspondenceId}/associations`,
	],
	getCorrespondenceAssociation: (correspondenceId, associationId) => [
		`correspondence/${correspondenceId}/association/${associationId}`,
	],
	publishClassification: (id) => [
		`classification/${id}/validate`,
		{ method: 'PUT' },
		(res) => res.text(),
	],
	putClassification: (classification) => [
		`classification/${classification.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(classification),
		},
		() => Promise.resolve(classification.id),
	],
};

export default API.buildApi('classifications', api);
