export default {
	getSims: id => [`metadataReport/${id}`],
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
