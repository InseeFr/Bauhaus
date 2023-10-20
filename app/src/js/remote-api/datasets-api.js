import { API } from 'bauhaus-utilities';

const api = {
	getAll: () => [''],
	getById: (id) => [id],
	getThemes: () => ["themes"],
	putDataset: dataset => [
		dataset.id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataset),
		},
		() => Promise.resolve(dataset.id),
	],
	postDataset: dataset => [
		'',
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataset),
		},
		res => res.text(),
	],
};

export default API.buildApi('datasets', api);

