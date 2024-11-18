// @ts-ignore
import { Row } from '@components/layout';
import { Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';
import D from '../../../deprecated-locales/build-dictionary';
import { PartialDataset } from '../../../model/Dataset';
import { useTitle } from '../../../utils/hooks/useTitle';
import { useDatasets } from '../../datasets';
import { HomePageMenu } from './menu';

export const Component = () => {
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
						items={data ?? []}
						childPath="datasets"
						autoFocus={true}
						advancedSearch={false}
						itemFormatter={(_: unknown, dataset: PartialDataset) =>
							dataset.label
						}
					/>
				</div>
			</Row>
		</div>
	);
};
