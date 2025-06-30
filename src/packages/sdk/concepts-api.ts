import { buildApi } from './build-api';

const api = {
	getConceptList: () => [''],
	getConceptSearchList: () => ['advanced-search'],
	getConceptValidateList: () => ['toValidate'],
	getConceptGeneral: (id: string) => [`concept/${id}`],
	getConceptLinkList: (id: string) => [`concept/${id}/links`],
	getNoteVersionList: (id: string, version: string) => [
		`concept/${id}/notes/${version}`,
	],
	postConcept: (concept: unknown) => [
		'concept',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(concept),
		},
		(res: any) =>
			res.text((id: string) => ({
				id,
				concept,
			})),
	],
	putConcept: (id: string, concept: unknown) => [
		`concept/${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(concept),
		},
		() => {},
	],
	deleteConcept: (id: string) => [
		`${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(id),
		},
		() => {},
	],
	putConceptValidList: (ids: string[]) => [
		`${ids}/validate`,
		{
			body: JSON.stringify(ids),
		},
		//do not process response
		() => {},
	],
	getConceptExportZipType: (
		ids: string[],
		type: string,
		lang: string,
		withConcepts: boolean,
	) => [
		`concept/export-zip/${ids.join(
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
	getConceptExportZip: (ids: string[]) => [
		`concept/export-zip/${ids.join(',')}`,
		{
			headers: {
				Accept: 'application/octet-stream',
				'Content-Type': 'text/plain',
			},
		},
		(res: Response) => res,
	],
	getConceptExport: (id: string) => [
		`concept/export/${id}`,
		{
			headers: {
				Accept: 'application/octet-stream',
				'Content-Type': 'text/plain',
			},
		},
		(res: Response) => res,
	],
	postConceptSend: (id: string, mailInfo: unknown) => [
		`concept/send/${id}`,
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(mailInfo),
		},
	],
	// Collections
	getCollectionDashboardList: () => ['collections/dashboard'],
	getCollectionValidateList: () => ['collections/toValidate'],
	postCollection: (collection: unknown) => [
		'collection',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(collection),
		},
		(res: Response) => res.text(),
	],
	putCollection: (id: string, collection: unknown) => [
		`collection/${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(collection),
		},
		() => id,
	],
	putCollectionValidList: (ids: string[]) => [
		`collections/${ids}/validate`,
		{
			body: JSON.stringify(ids),
		},
		//do not process resspoonse
		() => {},
	],
	getCollectionGeneral: (id: string) => [`collection/${id}`],
	getCollectionMembersList: (id: string) => [`collection/${id}/members`],
};

export const ConceptsApi = buildApi('concepts', api) as any;
