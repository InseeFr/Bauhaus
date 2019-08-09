export default {
	getIndicatorsList: () => ['indicators'],
	getIndicatorsSearchList: () => ['indicators_search'],

	getIndicator: id => [`indicator/${id}`],
	putIndicator: indicator => [
		`indicator/${indicator.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(indicator),
		},
		() => indicator.id,
	],
	postIndicator: indicator => [
		`indicator`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(indicator),
		},
		res => res.text().then(id => id),
	],
};
