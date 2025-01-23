const api = {
	getSeriesList: () => ['series/withSims'],
	getUserSeriesList: (stamp: string) => ['series/seriesWithStamp/' + stamp],
	getSeriesSearchList: () => ['series/advanced-search'],
	getSerie: (id: string) => [`series/${id}`],
	getSeriesWithReport: (id: string) => [`families/${id}/seriesWithReport`],
	publishSeries: (series: any) => [
		`series/${series.id}/validate`,
		{ method: 'PUT' },
		(res: Response) => res.text(),
	],
	putSeries: (series: any) => [
		`series/${series.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		() => Promise.resolve(series.id),
	],
	postSeries: (series: any) => [
		`series`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		(res: Response) => res.text(),
	],
};

export default api;
