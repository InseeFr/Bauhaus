import { useState } from 'react';
import Picker from '../../shared/picker-page';
import { getContentDisposition, Loading } from '@inseefr/wilco';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from 'js/i18n';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';
import { useQuery } from '@tanstack/react-query';
import ExportButtons from 'js/applications/collections/export-buttons';
import { useHistory } from 'react-router-dom';

const ConceptsToExportContainer = () => {
	useTitle(D.conceptsTitle, D.exportTitle);
	const [exporting, setExporting] = useState(false);
	const [ids, setIds] = useState([]);
	const history = useHistory();

	const { isLoading, data: concepts } = useQuery(['concepts'], () => {
		return api
			.getConceptList()
			.then((results) => ArrayUtils.sortArrayByLabel(results));
	});

	const exportConcept = (type, withConcepts, lang = 'lg1') => {
		setExporting(true);
		const promise = api.getConceptExportZipType(ids, type, lang, withConcepts);

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
			.then(() => history.push('/concepts'))
			.finally(() => setExporting(false));
	};



	if (exporting) {
		return <Loading textType={'exporting'} />;
	}
	if (isLoading) {
		return <Loading />;
	}

	return (
		<Picker
			items={concepts}
			title={D.exportTitle}
			panelTitle={D.conceptsExportPanelTitle}
			labelWarning={D.hasNotConceptToExport}
			handleAction={(value) => setIds(value)}
			context="concepts"
			ValidationButton={() => (
				<ExportButtons
					ids={ids}
					exporting={setExporting}
					exportHandler={exportConcept}
				/>
			)}
		/>
	);
};

export default ConceptsToExportContainer;
