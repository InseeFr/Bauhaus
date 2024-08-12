import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import D from '../../../../i18n/build-dictionary';
import { SearchableList } from '../../../../utils';
import { useDatasets } from '../../hooks';
import { HomePageMenu } from './menu';
import { Loading, Row } from '../../../../new-architecture/components';
import { useTitle } from '../../../../new-architecture/utils/hooks/useTitle';

export const DatasetHome = () => {
	const { data, isLoading } = useDatasets();

	useTitle(D.datasetsTitle, D.datasetsTitle);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="container">
			<Row>
				<HomePageMenu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.datasetsHomePageTitle} col={12} offset={0} />
					<SearchableList
						items={(data as any) ?? []}
						childPath="datasets"
						autoFocus={true}
						advancedSearch={false}
						itemFormatter={(_: any, dataset: any) => dataset.label}
					/>
				</div>
			</Row>
		</div>
	);
};
