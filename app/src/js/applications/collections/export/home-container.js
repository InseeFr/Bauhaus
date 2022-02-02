import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CollectionsToExport from './home';
import { getContentDisposition, Loading } from '@inseefr/wilco';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from '../../../i18n/build-dictionary';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';

const CollectionsToExportContainer = () => {
	useTitle(D.collectionsTitle, D.exportTitle)
	const history = useHistory();
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);

	const handleExportCollectionList = useCallback(
		(ids, MimeType) => {
			setExporting(true);
			Promise.all(ids.map(id => {
				let fileName;
				return api
					.getCollectionExport(id, MimeType)
					.then(res => {
						fileName = getContentDisposition(
							res.headers.get('Content-Disposition')
						)[1];
						return res;
					})
					.then(res => res.blob())
					.then(blob => {
						return FileSaver.saveAs(blob, fileName);
					});
			}))
				.then(() => history.push("/collections"))
				.finally(() => setExporting(false))
		},
		[]
	);


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
			handleExportCollectionList={handleExportCollectionList}
		/>
	);
};

export default CollectionsToExportContainer;
