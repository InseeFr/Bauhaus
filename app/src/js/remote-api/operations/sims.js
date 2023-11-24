const hasDocument = (sims, withDocument) => {
	if(!withDocument){
		return false;
	}
	// We activate the download of a ZIP with documents only if we have at least on file using the file:// protocol.
	const hasDocument = Object.values(sims.rubrics).filter(rubric => {
		return rubric.documentsLg1?.find(doc => {
			return doc.url.indexOf("file") === 0
		})
	})?.length > 0

	return hasDocument
}

export default {
	getSims: (id) => [`metadataReport/${id}`],
	getDefaultSims: () => ['metadataReport/default'],
	getOwners: (id) => [`metadataReport/Owner/${id}`],
	exportSims: (id, config, sims) => [
		`metadataReport/export/${id}?emptyMas=${config.emptyMas}&lg1=${config.lg1}&lg2=${config.lg2}&document=${hasDocument(sims, config.document)}`,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				Accept: 'application/vnd.oasis.opendocument.text',
				'Content-Type': 'text/plain',
			},
		},
		async (res) => {
			const blob = await res.blob();
			const a = document.createElement("a");
			document.body.appendChild(a);

			const url = window.URL.createObjectURL(blob);
			a.href = url;

			if(hasDocument(sims, config.document)){
				const header = res.headers.get('Content-Disposition');
				const parts = header.split(';');
				const fileName = parts[1].split('=')[1]?.replace(/\"/, "");
				a.download = fileName + '.zip';
			} else {
				const fileName = sims.labelLg1?.replace(/[/<>*:?|]/gi, '');
				a.download = fileName + '.odt';
			}
			a.click();
			window.URL.revokeObjectURL(url);

			if(res.headers.get('X-Missing-Documents')){
				return new Set(res.headers.get('X-Missing-Documents').split(','))
			}
			return new Set();
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
