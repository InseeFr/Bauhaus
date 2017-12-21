import React from 'react';
import TableRmes from 'js/components/shared/table-rmes';
import { rowParams, buildData } from './summary-data';
import { rowParamsStamps, buildDataStamps } from './stamps-data';

function CollectionsSummary({ collectionsData }) {
	const data = buildData(collectionsData);
	const dataStamps = buildDataStamps(collectionsData);
	return (
		<div>
			<div className="col-md-8 col-md-offset-2">
				<TableRmes rowParams={rowParams} data={data} />
			</div>
			<div className="col-md-8 col-md-offset-2">
				<TableRmes
					rowParams={rowParamsStamps}
					data={dataStamps}
					search={true}
					pagination={true}
				/>
			</div>
		</div>
	);
}

export default CollectionsSummary;
