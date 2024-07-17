import { Table } from '@inseefr/wilco';
import D from '../../../../../../i18n';
import { rowParams, buildData } from './summary-data';
import { rowParamsStamps, buildDataStamps } from './stamps-data';
import { DateUtils } from '../../../../../../utils';

function ConceptsSummary({ conceptsData }) {
	const data = buildData(conceptsData);
	const dataStamps = buildDataStamps(conceptsData);
	return (
		<div>
			<h3 className="text-center">
				{D.dashboardConceptsSummaryTitle} {DateUtils.today()}
			</h3>
			<Table rowParams={rowParams} data={data} />
			<Table
				rowParams={rowParamsStamps}
				data={dataStamps}
				search={true}
				pagination={true}
			/>
		</div>
	);
}

export default ConceptsSummary;
