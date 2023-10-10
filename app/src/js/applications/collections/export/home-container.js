import { Loading, getContentDisposition } from '@inseefr/wilco';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from '../../../i18n/build-dictionary';
import api from '../../../remote-api/concepts-collection-api';
import Picker from '../../shared/picker-page';
import ExportButtons from '../export-buttons';
import FileSaver from 'file-saver';

const CollectionsToExportContainer = () => {
	useTitle(D.collectionsTitle, D.exportTitle);
	const history = useHistory();
	const [ids, setIds] = useState([]);
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		api
			.getCollectionList()
			.then((body) => setCollections(ArrayUtils.sortArrayByLabel(body)))
			.finally(() => setLoading(false));
	}, []);

	if (exporting) return <Loading textType="exporting" />;
	if (loading) return <Loading />;

	const exportCollection = (type, withConcepts, lang = 'lg1') => {
		setExporting(true);
		let promise;
		if (ids.length > 1) {
			promise = api.getCollectionExportZipByType(ids, type, lang, withConcepts);
		} else if (ids.length === 1) {
			promise = api.getCollectionExportByType(
				ids[0],
				'application/vnd.oasis.opendocument.text',
				type,
				lang,
				withConcepts
			);
		}

		let fileName;
		return promise
			.then((res) => {
				fileName = getContentDisposition(
					res.headers.get('Content-Disposition')
				)[1];
				return res;
			})
			.then((res) => res.blob())
			.then((blob) => {
				return FileSaver.saveAs(blob, fileName);
			})
			.then(() => history.push('/collections'))
			.finally(() => setExporting(false));
	};
	return (
		<Picker
			items={collections}
			title={D.exportTitle}
			panelTitle={D.collectionsExportPanelTitle}
			labelWarning={D.hasNotCollectionToExport}
			handleAction={(value) => setIds(value)}
			context="collections"
			disabled={ids.length < 1}
			disabledWarningMessage={D.classificationWarningMessageWhenExporting}
			ValidationButton={() => (
				<>
					<ExportButtons
						ids={ids}
						disabled={ids.length < 1}
						exporting={setExporting}
						exportHandler={exportCollection}
					/>
				</>
			)}
		/>
	);
};

export default CollectionsToExportContainer;
