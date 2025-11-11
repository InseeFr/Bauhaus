import { buildApi } from './build-api';

const api = {
	getCollectionExportZipByType: (
		ids: string[],
		type: string,
		lang = 'lg1',
		withConcepts = false,
	) => [
		`export-zip/${ids.join(
			'_AND_',
		)}/${type}?langue=${lang}&withConcepts=${withConcepts}`,
		{
			headers: {
				Accept: 'application/octet-stream',
				'Content-Type': 'text/plain',
			},
		},
		(res: Response) => res,
	],
	getCollectionExportByType: (
		id: string,
		MimeType: string,
		type: string,
		lang = 'lg1',
		withConcepts = false,
	) => [
		`export/${id}/${type}?langue=${lang}&withConcepts=${withConcepts}`,
		{
			headers: {
				Accept: MimeType,
				'Content-Type': 'text/plain',
			},
		},
		(res: Response) => res,
	],
};

export const CollectionApi = buildApi('concepts-collections', api) as any;
