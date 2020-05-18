import React from 'react';
import { Table } from '@inseefr/wilco';
import D from 'js/i18n';
import { rowParams, buildData } from './summary-data';
import { rowParamsStamps, buildDataStamps } from './stamps-data';
import { DateUtils } from 'bauhaus-utilities';

function CollectionsSummary({ collectionsData }) {
	const data = buildData(collectionsData);
	const dataStamps = buildDataStamps(collectionsData);
	return (
		<div>
			<h3 className="text-center">
				{D.dashboardCollectionsSummaryTitle} {DateUtils.today()}
			</h3>
			<div className="col-md-8 col-md-offset-2">
				<Table rowParams={rowParams} data={data} />
			</div>
			<div className="col-md-8 col-md-offset-2">
				<Table
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
