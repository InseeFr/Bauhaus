import React from 'react';
import TableRmes from 'js/components/shared/table-rmes';
import { rowParams, buildData } from './summary-data';
import { rowParamsStamps, buildDataStamps } from './stamps-data';
import { today } from 'js/utils/moment';

function ConceptsSummary({ conceptsData }) {
	const data = buildData(conceptsData);
	const dataStamps = buildDataStamps(conceptsData);
	return (
		<div>
			<h3 className="centered">Etat de la base des concepts au {today()}</h3>
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
