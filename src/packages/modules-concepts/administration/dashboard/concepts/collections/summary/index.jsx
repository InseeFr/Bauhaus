import { Column } from 'primereact/column';

import { Panel } from '@components/panel';

import { DataTable } from '../../../../../../components/datatable';
import D from '../../../../../../deprecated-locales';
import { today } from '../../../../../../utils/date-utils';
import { buildDataStamps } from './stamps-data';
import { buildData } from './summary-data';

function CollectionsSummary({ collectionsData }) {
	const data = buildData(collectionsData);
	const dataStamps = buildDataStamps(collectionsData);
	return (
		<div>
			<h3 className="text-center">
				{D.dashboardCollectionsSummaryTitle} {today()}
			</h3>

			<Panel>
				<DataTable value={data} withPagination={false}>
					<Column field="type" header=""></Column>
					<Column field="total" header={D.totalTitle}></Column>
				</DataTable>
			</Panel>

			<Panel>
				<DataTable value={dataStamps} globalFilterFields={['stamp']}>
					<Column
						field="stamp"
						header={D.dashboardCollectionsByCreatorTitle}
					></Column>
					<Column field="total" header={D.totalTitle}></Column>
				</DataTable>
			</Panel>
		</div>
	);
}

export default CollectionsSummary;
