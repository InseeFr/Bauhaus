export default {
	getSims: (id) => [`metadataReport/${id}`],
	getDefaultSims: () => ['metadataReport/default'],
	getOwners: (id) => [`metadataReport/Owner/${id}`],
	exportSims: (id, config, sims) => [
		`metadataReport/export/${id}?emptyMas=${config.emptyMas}&lg1=${config.lg1}&lg2=${config.lg2}&document=${config.document}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/vnd.oasis.opendocument.text',
				'Content-Type': 'text/plain',
			},
		},
		(res) => {
			return res.blob().then((blob) => {
				const a = document.createElement("a");
				document.body.appendChild(a);
				const url = window.URL.createObjectURL(blob);
				a.href = url;

				const fileName = sims.labelLg1?.replace(/[/<>*:?|]/gi, '');
				if(config.document){
					a.download = fileName + '.zip';
				} else {
					a.download = fileName + '.odt';
				}
				a.click();
				window.URL.revokeObjectURL(url);
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
