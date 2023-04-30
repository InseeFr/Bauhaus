import { useState, useEffect } from 'react';
import CollectionsToExport from './home';
import { getContentDisposition, Loading } from '@inseefr/wilco';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from '../../../i18n/build-dictionary';
import api from '../../../remote-api/concepts-collection-api';
import FileSaver from 'file-saver';

const CollectionsToExportContainer = () => {
	useTitle(D.collectionsTitle, D.exportTitle)
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);

	const handleExportCollectionList = type => {
		return (ids, MimeType, lang = "lg1", withConcepts) => {
			setExporting(true);

			let promise;
			if(ids.length > 1){
				promise = api.getCollectionExportZipByType(ids, type, lang, withConcepts)
			} else if(ids.length === 1){
				promise = api.getCollectionExportByType(ids[0], MimeType, type, lang, withConcepts);
			}

			if(!!promise){
				let fileName;
				promise
					.then(res => {
						fileName = getContentDisposition(
							res.headers.get('Content-Disposition')
						)[1];
						return res;
					})
					.then(res => res.blob())
					.then(blob => {
						return FileSaver.saveAs(blob, fileName);
					})
					.finally(() => setExporting(false));
			}
		}
	}

	useEffect(() => {
		api.getCollectionList()
			.then(body => setCollections(ArrayUtils.sortArrayByLabel(body)))
			.finally(() => setLoading(false))
	}, [])

	if(exporting) return <Loading textType="exporting" />;
	if (loading) return <Loading />;
	return (
		<CollectionsToExport
			collections={collections}
			exportOdt={handleExportCollectionList('odt')}
			exportOds={handleExportCollectionList('ods')}
		/>
	);
};

export default CollectionsToExportContainer;
