import { Row } from '@components/layout';
import { Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales/build-dictionary';
import { PartialDistribution } from '../../../model/Dataset';
import { useDistributions } from '../../datasets';
import { HomePageMenu } from './menu';

export const Component = () => {
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
						items={data ?? []}
						childPath="datasets/distributions"
						advancedSearch
						searchUrl="/datasets/distributions/search"
						autoFocus
						itemFormatter={(_: unknown, distribution: PartialDistribution) =>
							distribution.labelLg1
						}
					/>
				</div>
			</Row>
		</div>
	);
};
