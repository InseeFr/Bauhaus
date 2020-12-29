export default {
	getSims: (id) => [`metadataReport/${id}`],
	getDefaultSims: () => ['metadataReport/default'],
	getOwners: (id) => [`metadataReport/Owner/${id}`],
	exportSims: (id) => [
		`metadataReport/export/${id}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/vnd.oasis.opendocument.text',
				'Content-Type': 'text/plain',
			},
		},
		(res) => {
			return res.blob().then((blob) => {
				var file = window.URL.createObjectURL(blob);
				window.location.assign(file);
			});
		},
	],
	deleteSims: (sims) => [
		`metadataReport/delete/${sims.id}`,
		(res) => res.text(),
	],
	publishSims: (sims) => [
		`metadataReport/validate/${sims.id}`,
		{ method: 'PUT' },
		(res) => res.text(),
	],
	putSims: (sims) => [
		`metadataReport/${sims.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sims),
		},
		() => {},
	],
	postSims: (sims) => [
		`metadataReport`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sims),
		},
		(res) => res.text().then((id) => id),
	],
};
