import D from '../../../i18n/build-dictionary';
import ExportButton from '../dropdown';
import React from 'react';
import api from '../../../remote-api/concepts-collection-api';
import { getContentDisposition } from '@inseefr/wilco';
import FileSaver from 'file-saver';


export default ({ ids, exporting, onDone }) => {
	const exportCollection = (type, withConcepts, lang = "lg1") => {
		exporting(true);
		let promise;
		if(ids.length > 1){
			promise = api.getCollectionExportZipByType(ids, type, lang, withConcepts)
		} else if(ids.length === 1){
			promise = api.getCollectionExportByType(ids[0], 'application/vnd.oasis.opendocument.text', type, lang, withConcepts);
		}

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
			.then(() => onDone ? onDone() : Promise.resolve())
			.finally(() => exporting(false))
	}

	return (
		<ExportButton actions={[
			<button type="button" onClick={() => exportCollection('ods', false)}>{D.btnOdsExporter}</button>,
			<button type="button" onClick={() => exportCollection('odt', false)}>{D.btnOdtLg1Exporter}</button>,
			<button type="button" onClick={() => exportCollection('odt', false, 'lg2')}>{D.btnOdtLg2Exporter}</button>,
			<button type="button" onClick={() => exportCollection('odt', true)}>{D.btnCollectionConceptExporter}</button>
		]}></ExportButton>
	)
}
