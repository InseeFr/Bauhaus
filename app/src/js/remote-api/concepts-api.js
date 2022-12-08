import { API, ConceptsAPIRoutes } from 'bauhaus-utilities';

const api = {
	...ConceptsAPIRoutes,
	getConceptSearchList: () => ['advanced-search'],
	getConceptValidateList: () => ['toValidate'],
	getConceptGeneral: id => [`concept/${id}`],
	getConceptLinkList: id => [`concept/${id}/links`],
	getNoteVersionList: (id, version) => [`concept/${id}/notes/${version}`],
	postConcept: concept => [
		'concept',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(concept),
		},
		res =>
			res.text(id => ({
				id,
				concept,
			})),
	],
	putConcept: (id, concept) => [
		`concept/${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(concept),
		},
		() => {},
	],
	deleteConcept: id => [
		`${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(id),
		},
		() => {},
	],
	putConceptValidList: ids => [
		`validate/${ids}`,
		{
			body: JSON.stringify(ids),
		},
		//do not process response
		() => {},
	],
	getConceptExportZip: (ids) => [
		`concept/export-zip/${ids.join(',')}`,
		{
			headers: {
				Accept: "application/octet-stream",
				'Content-Type': 'text/plain',
			},
		},
		res => res,
	],
	getConceptExport: (id) => [
		`concept/export/${id}`,
		{
			headers: {
				Accept: "application/octet-stream",
				'Content-Type': 'text/plain',
			},
		},
		res => res,
	],
	postConceptSend: (id, mailInfo) => [
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
	getCollectionList: () => ['collections'],
	getCollectionDashboardList: () => ['collections/dashboard'],
	getCollectionValidateList: () => ['collections/toValidate'],
	postCollection: collection => [
		'collection',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(collection),
		},
		() => {},
	],
	putCollection: (id, collection) => [
		`collection/${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(collection),
		},
		() => {},
	],
	putCollectionValidList: ids => [
		`collections/validate/${ids}`,
		{
			body: JSON.stringify(ids),
		},
		//do not process resspoonse
		() => {},
	],
	getCollectionGeneral: id => [`collection/${id}`],
	getCollectionMembersList: id => [`collection/${id}/members`],
	getCollectionExportZipByType: (ids, type) => [
		`collection/export-zip/${ids.join(',')}/${type}`,
		{
			headers: {
				Accept: "application/octet-stream",
				'Content-Type': 'text/plain',
			},
		},
		res => res,
	],
	getCollectionExport: (id, MimeType) => [
		`collection/export/${id}`,
		{
			headers: {
				Accept: MimeType,
				'Content-Type': 'text/plain',
			},
		},
		res => res,
	],
	getCollectionExportByType: (id, MimeType, type, lang) => [
		`collection/export/${id}/${type}?langue=${lang}`,
		{
			headers: {
				Accept: MimeType,
				'Content-Type': 'text/plain',
			},
		},
		res => res,
	],
	postCollectionSend: (id, mailInfo) => [
		`collection/send/${id}`,
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(mailInfo),
		},
	],
};

export default API.buildApi('concepts', api);
