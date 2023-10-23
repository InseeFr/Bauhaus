import { API } from 'bauhaus-utilities';

const api = {
	getAll: () => [''],
	getById: (id) => [id],
	putDistribution: distribution => [
		distribution.id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(distribution),
		},
		() => Promise.resolve(distribution.id),
	],
	postDistribution: distribution => [
		'',
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(distribution),
		},
		res => res.text(),
	],
};

export default API.buildApi('distribution', api);

