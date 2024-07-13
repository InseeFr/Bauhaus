import { API } from '../utils';

const api = {
	getCollectionList: () => ['collections'],
	getCollectionExportZipByType: (
		ids,
		type,
		lang = 'lg1',
		withConcepts = false
	) => [
		`export-zip/${ids.join(
			'_AND_'
		)}/${type}?langue=${lang}&withConcepts=${withConcepts}`,
		{
			headers: {
				Accept: 'application/octet-stream',
				'Content-Type': 'text/plain',
			},
		},
		(res) => res,
	],
	getCollectionExportByType: (
		id,
		MimeType,
		type,
		lang = 'lg1',
		withConcepts = false
	) => [
		`export/${id}/${type}?langue=${lang}&withConcepts=${withConcepts}`,
		{
			headers: {
				Accept: MimeType,
				'Content-Type': 'text/plain',
			},
		},
		(res) => res,
	],
};

export default API.buildApi('concepts-collections', api);
