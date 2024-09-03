import { buildApi } from './build-api';
import { Distribution } from '../model/Dataset';

const api = {
	getAll: () => [''],
	getById: (id: string) => [id],
	getDatasets: () => ['datasets'],
	publish: (id: string) => [
		`${id}/validate`,
		{ method: 'PUT' },
		(res: Response) => res.text(),
	],
	putDistribution: (distribution: Distribution) => [
		distribution.id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(distribution),
		},
		() => Promise.resolve(distribution.id),
	],
	postDistribution: (distribution: Distribution) => [
		'',
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(distribution),
		},
		(res: Response) => res.text(),
	],
	deleteDistribution: (id: string) => [`${id}`, {}, () => Promise.resolve(id)],
};

export const DistributionApi = buildApi('distribution', api) as any;