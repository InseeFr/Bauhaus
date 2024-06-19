import { PageTitle } from '@inseefr/wilco';
import { SearchableList, Row, useTitle } from 'js/utils';
import D from '../../../../i18n/build-dictionary';
import React from 'react';
import { useDistributions } from '../../hooks';
import { HomePageMenu } from './menu';

export const DistributionHome = () => {
	const { data } = useDistributions();

	useTitle(D.datasetsTitle, D.distributionsTitle);

	return (
		<div className="container">
			<Row>
				<HomePageMenu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.distributionsHomePageTitle} col={12} offset={0} />
					<SearchableList
						items={data ?? []}
						childPath="datasets/distributions"
						autoFocus={true}
						advancedSearch={false}
						itemFormatter={(_, dataset) => dataset.labelLg1}
					/>
				</div>
			</Row>
		</div>
	);
};
