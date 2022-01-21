export default {
	getSeriesList: () => ['series/withSims'],
	getUserSeriesList: (stamp) => ['series/seriesWithStamp/' + stamp],
	getSeriesSearchList: () => ['series/advanced-search'],
	getSerie: id => [`series/${id}`],
	publishSeries: series => [
		`series/validate/${series.id}`,
		{ method: 'PUT' },
		res => res.text(),
	],
	putSeries: series => [
		`series/${series.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		() => Promise.resolve(series.id),
	],
	postSeries: series => [
		`series`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		res => res.text(),
	],
};
