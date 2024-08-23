// @ts-ignore
import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import D from '../../../deprecated-locales/build-dictionary';
import { useDistributions } from '../../datasets';
import { HomePageMenu } from './menu';
import { Loading, Row, SearchableList } from '../../../components';
import { useTitle } from '../../../utils/hooks/useTitle';

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
						advancedSearch={false}
						itemFormatter={(_: any, dataset: any) => dataset.labelLg1}
					/>
				</div>
			</Row>
		</div>
	);
};
