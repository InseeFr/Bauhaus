import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Loading } from '@inseefr/wilco';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from '../../../i18n/build-dictionary';
import api from '../../../remote-api/concepts-collection-api';
import Picker from '../../shared/picker-page';
import ExportButtons from '../export-buttons';

const CollectionsToExportContainer = () => {
	useTitle(D.collectionsTitle, D.exportTitle);
	const history = useHistory();
	const [ids, setIds] = useState([]);
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		api.getCollectionList()
			.then(body => setCollections(ArrayUtils.sortArrayByLabel(body)))
			.finally(() => setLoading(false))
	}, [])

	if(exporting) return <Loading textType="exporting" />;
	if (loading) return <Loading />;

	console.log(ids)
	return (
		<Picker
			items={collections}
			title={D.exportTitle}
			panelTitle={D.collectionsExportPanelTitle}
			labelWarning={D.hasNotCollectionToExport}
			handleAction={value => setIds(value)}
			context="collections"
			ValidationButton={() => <ExportButtons ids={ids} onDone={() => history.push('/collections')} exporting={setExporting}/> }
		/>
	);
};

export default CollectionsToExportContainer;
