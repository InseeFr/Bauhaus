import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import { SearchableList, useTitle } from '../../../../utils';
import D from '../../../../i18n/build-dictionary';
import { useDistributions } from '../../hooks';
import { HomePageMenu } from './menu';
import { Loading, Row } from '../../../../new-architecture/components';

export const DistributionHome = () => {
	const { data, isLoading } = useDistributions();

	useTitle(D.datasetsTitle, D.distributionsTitle);

	if (isLoading) {
		return <Loading />;
	}
	return (
		<div className="container">
			<Row>
				<HomePageMenu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.distributionsHomePageTitle} col={12} offset={0} />
					<SearchableList
						items={(data as any) ?? []}
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
