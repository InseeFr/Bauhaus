export default {
	getSims: id => [`metadataReport/${id}`],
	publishSims: series => [
		`metadataReport/validate/${series.id}`,
		{ method: 'PUT' },
		res => res.text(),
	],
	putSims: sims => [
		`metadataReport/${sims.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sims),
		},
		() => {},
	],
	postSims: sims => [
		`metadataReport`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sims),
		},
		res => res.text().then(id => id),
	],
};
