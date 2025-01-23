const api = {
	getOperationsList: () => ['operations'],

	getOperationsSearchList: () => ['operations/advanced-search'],
	getOperation: (id: string) => [`operation/${id}`],
	publishOperation: (operation: any) => [
		`operation/${operation.id}/validate`,
		{ method: 'PUT' },
		(res: Response) => res.text(),
	],
	putOperation: (operation: any) => [
		`operation/${operation.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		() => Promise.resolve(operation.id),
	],
	postOperation: (operation: any) => [
		`operation`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		(res: Response) => res.text(),
	],
	getOperationsWithoutReport: (idSerie: string) => [
		`series/${idSerie}/operationsWithoutReport`,
	],
	getOperationsWithReport: (idSerie: string) => [
		`series/${idSerie}/operationsWithReport`,
	],
} as any;

export default api;
