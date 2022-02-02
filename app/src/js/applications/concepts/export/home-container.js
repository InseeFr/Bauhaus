import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ConceptsToExport from './home';
import { getContentDisposition, Loading } from '@inseefr/wilco';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from 'js/i18n';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';

const ConceptsToExportContainer = () => {

	useTitle(D.conceptsTitle, D.exportTitle);
	const history = useHistory();
	const [concepts, setConcepts] = useState([])
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		api.getConceptList().then(results => {
			setConcepts(ArrayUtils.sortArrayByLabel(results));
		}).finally(() => setLoading(false))
	}, [])

	const handleExportConceptList = (ids, MimeType) => {
		Promise.all(ids.map(id => {
			let fileName;
			api
				.getConceptExport(id, MimeType)
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
		.then(() => history.push("/concepts"))
		.finally(() => setExporting(false))
	}


	if(exporting){
		return <Loading textType={"exporting"} />;
	}
	if (loading) {
		return <Loading />;
	}

	return (
		<ConceptsToExport
			concepts={concepts}
			handleExportConceptList={handleExportConceptList}
		/>
	);
}

export default ConceptsToExportContainer
