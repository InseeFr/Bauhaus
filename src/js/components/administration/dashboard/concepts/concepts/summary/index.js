import React from 'react';
import TableRmes from 'js/components/shared/table-rmes';
import { rowParams, buildData } from './summary-data';
import { rowParamsStamps, buildDataStamps } from './stamps-data';

function ConceptsSummary({ conceptsData }) {
	const data = buildData(conceptsData);
	const dataStamps = buildDataStamps(conceptsData);
	return (
		<div>
			<TableRmes
				rowParams={rowParams}
				data={data}
				csvFileName="export_concepts_recap.csv"
			/>
			<TableRmes
				rowParams={rowParamsStamps}
				data={dataStamps}
				search={true}
				pagination={true}
				csvFileName="export_concepts_par_timbre.csv"
			/>
		</div>
	);
}

export default ConceptsSummary;
