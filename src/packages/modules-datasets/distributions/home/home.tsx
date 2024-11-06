import { Loading, PageTitle, SearchableList } from '../../../components';
import { Row } from '../../../components/layout';
import D from '../../../deprecated-locales/build-dictionary';
import { PartialDistribution } from '../../../model/Dataset';
import { useTitle } from '../../../utils/hooks/useTitle';
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
						advancedSearch={false}
						itemFormatter={(_: unknown, distribution: PartialDistribution) =>
							distribution.labelLg1
						}
					/>
				</div>
			</Row>
		</div>
	);
};
