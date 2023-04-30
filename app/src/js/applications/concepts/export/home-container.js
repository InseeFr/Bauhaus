import { useState } from 'react';
import ConceptsToExport from './home';
import { getContentDisposition, Loading } from '@inseefr/wilco';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from 'js/i18n';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';
import { useQuery } from '@tanstack/react-query';

const ConceptsToExportContainer = () => {

	useTitle(D.conceptsTitle, D.exportTitle);
	const [exporting, setExporting] = useState(false);

	const { isLoading, data: concepts } = useQuery(['concepts'], () => {
		return api.getConceptList().then(results => ArrayUtils.sortArrayByLabel(results))
	});

	const handleExportConceptList = type => (ids, lang, withConcepts) => {
		setExporting(true)
		const promise = api.getConceptExportZipType(ids, type, lang, withConcepts)
		
		let fileName;
		return promise.then(res => {
				fileName = getContentDisposition(
					res.headers.get('Content-Disposition')
				)[1];
				return res;
			})
			.then(res => res.blob())
			.then(blob => {
				return FileSaver.saveAs(blob, fileName);
			})
			.finally(() => setExporting(false))
	}


	if(exporting){
		return <Loading textType={"exporting"} />;
	}
	if (isLoading) {
		return <Loading />;
	}

	return (
		<ConceptsToExport
			concepts={concepts}
			handleExportConceptListOdt={handleExportConceptList('odt')}
			handleExportConceptListOds={handleExportConceptList('ods')}
		/>
	);
}

export default ConceptsToExportContainer
