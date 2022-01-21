export default {
	getOperationsList: () => ['operations'],

	getOperationsSearchList: () => ['operations/advanced-search'],
	getOperation: id => [`operation/${id}`],
	publishOperation: operation => [
		`operation/validate/${operation.id}`,
		{ method: 'PUT' },
		res => res.text(),
	],
	putOperation: operation => [
		`operation/${operation.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		() => Promise.resolve(operation.id),
	],
	postOperation: operation => [
		`operation`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		res => res.text(),
	],
	getOperationsWithoutReport: idSerie => [
		`series/${idSerie}/operationsWithoutReport`,
	],
	getOperationsWithReport: idSerie => [
		`series/${idSerie}/operationsWithReport`,
	],
};
