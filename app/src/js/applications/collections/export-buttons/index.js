import D from '../../../i18n/build-dictionary';
import ExportButton from '../dropdown';
import React from 'react';

export default ({ exportHandler }) => {
	return (
		<ExportButton actions={[
			<button type="button" onClick={() => exportHandler('ods', false)}>{D.btnOdsExporter}</button>,
			<button type="button" onClick={() => exportHandler('odt', false)}>{D.btnOdtLg1Exporter}</button>,
			<button type="button" onClick={() => exportHandler('odt', false, 'lg2')}>{D.btnOdtLg2Exporter}</button>,
			<button type="button" onClick={() => exportHandler('odt', true)}>{D.btnCollectionConceptExporter}</button>
		]}></ExportButton>
	)
}
