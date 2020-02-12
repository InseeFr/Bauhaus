import React from 'react';
import { TableRmes } from '@inseefr/wilco';
import D from 'js/i18n';
import { rowParams, buildData } from './summary-data';
import { rowParamsStamps, buildDataStamps } from './stamps-data';
import { today } from 'js/utils/moment';

function ConceptsSummary({ conceptsData }) {
	const data = buildData(conceptsData);
	const dataStamps = buildDataStamps(conceptsData);
	return (
		<div>
			<h3 className="centered">
				{D.dashboardConceptsSummaryTitle} {today()}
			</h3>
			<TableRmes rowParams={rowParams} data={data} />
			<TableRmes
				rowParams={rowParamsStamps}
				data={dataStamps}
				search={true}
				pagination={true}
			/>
		</div>
	);
}

export default ConceptsSummary;
