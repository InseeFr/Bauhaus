import { API } from 'bauhaus-utilities';

const api = {
	getAll: () => [''],
	getArchivageUnits: () => ['archivageUnits'],
	getById: (id) => [id],
	publish: (id) => [`${id}/validate`, { method: 'PUT' }, (res) => res.text()],
	putDataset: (dataset) => [
		dataset.id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataset),
		},
		() => Promise.resolve(dataset.id),
	],
	postDataset: (dataset) => [
		'',
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataset),
		},
		(res) => res.text(),
	],
};

export default API.buildApi('datasets', api);
