import { PageTitle } from '@inseefr/wilco';
import D from '../../../../i18n/build-dictionary';
import { SearchableList, Row } from 'bauhaus-utilities';
import React from 'react';
import { useDatasets } from '../../hooks';
import { HomePageMenu } from './menu';

export const DatasetHome = () => {
	const { data } = useDatasets();

	return (
		<div className="container">
			<Row>
				<HomePageMenu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.datasetsTitle} col={12} offset={0} />
					<SearchableList
						items={data ?? []}
						childPath="datasets"
						autoFocus={true}
						advancedSearch={false}
						itemFormatter={(_, dataset) => dataset.label}
					/>
				</div>
			</Row>
		</div>
	);
};
