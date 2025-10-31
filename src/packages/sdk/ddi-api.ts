import { buildApi } from './build-api';

const api = {
	getPhysicalInstances: () => ['physical-instance'],
	getPhysicalInstance: (id: string) => ['physical-instance/' + id],
	patchPhysicalInstance: (
		id: string,
		data: { physicalInstanceLabel: string; dataRelationshipName: string },
	) => [
		'physical-instance/' + id,
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
	],
	convertToDDI3: (data: unknown) => [
		'convert/ddi4-to-ddi3',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
	],
};

export const DDIApi = buildApi('ddi', api) as any;
