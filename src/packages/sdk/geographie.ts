// API
import { buildApi } from './build-api';

const apiConfig = {
	getAll: () => ['territories'],
	postTerritory: (territory: any) => [
		`territory`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(territory),
		},
		(res: Response) => res.text(),
	],
	putTerritory: (id: string, territory: any) => [
		`territory/` + id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(territory),
		},
		(res: Response) => res.text(),
	],
};
export const GeographieApi = buildApi('geo', apiConfig);
