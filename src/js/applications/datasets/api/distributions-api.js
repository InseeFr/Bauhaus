import { API } from '../../../utils';

const api = {
	getAll: () => [''],
	getById: (id) => [id],
	getDatasets: () => ['datasets'],
	publish: (id) => [`${id}/validate`, { method: 'PUT' }, (res) => res.text()],
	putDistribution: (distribution) => [
		distribution.id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(distribution),
		},
		() => Promise.resolve(distribution.id),
	],
	postDistribution: (distribution) => [
		'',
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(distribution),
		},
		(res) => res.text(),
	],
	deleteDistribution: (id) => [`${id}`, (res) => res.text()],
};

export default API.buildApi('distribution', api);
