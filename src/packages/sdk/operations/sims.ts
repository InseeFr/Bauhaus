import { Sims } from '../../model/Sims';
import { saveFileFromHttpResponse } from '../../utils/files';
import { OPEN_DOCUMENT_TEXT_MIME_TYPE } from '../constants';

const hasDocument = (sims: any, withDocument: boolean) => {
	if (!withDocument) {
		return false;
	}
	// We activate the download of a ZIP with documents only if we have at least on file using the file:// protocol.
	const hasDocument =
		Object.values(sims.rubrics).filter((rubric: any) => {
			return rubric.documentsLg1?.find((doc: any) => {
				return doc.url.startsWith('file');
			});
		})?.length > 0;

	return hasDocument;
};

const api = {
	getSims: (id: string) => [`metadataReport/${id}`],
	getDefaultSims: () => ['metadataReport/default'],
	getOwners: (id: string) => [`metadataReport/Owner/${id}`],
	exportSims: (id: string, config: any, sims: Sims) => [
		`metadataReport/export/${id}?emptyMas=${config.emptyMas}&lg1=${
			config.lg1
		}&lg2=${config.lg2}&document=${hasDocument(sims, config.document)}`,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				Accept: OPEN_DOCUMENT_TEXT_MIME_TYPE,
				'Content-Type': 'text/plain',
			},
		},
		async (response: any) => {
			await saveFileFromHttpResponse(response);

			if (response.headers.get('X-Missing-Documents')) {
				return new Set(response.headers.get('X-Missing-Documents').split(','));
			}
			return new Set();
		},
	],
	deleteSims: (sims: Sims) => [
		`metadataReport/delete/${sims.id}`,
		(res: Response) => res.text(),
	],
	publishSims: (sims: Sims) => [
		`metadataReport/${sims.id}/validate`,
		{ method: 'PUT' },
		(res: Response) => res.text(),
	],
	putSims: (sims: Sims) => [
		`metadataReport/${sims.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sims),
		},
		() => {},
	],
	postSims: (sims: Sims) => [
		`metadataReport`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sims),
		},
		(res: Response) => res.text().then((id) => id),
	],
} as any;

export default api;
