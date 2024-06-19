import { PageTitle } from '@inseefr/wilco';
import D from '../../../../i18n/build-dictionary';
import { SearchableList, Row, useTitle } from 'js/utils';
import React from 'react';
import { useDatasets } from '../../hooks';
import { HomePageMenu } from './menu';

export const DatasetHome = () => {
	const { data } = useDatasets();

	useTitle(D.datasetsTitle, D.datasetsTitle);

	return (
		<div className="container">
			<Row>
				<HomePageMenu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.datasetsHomePageTitle} col={12} offset={0} />
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
