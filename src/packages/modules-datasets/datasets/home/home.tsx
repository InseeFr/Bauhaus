// @ts-ignore
import D from '../../../deprecated-locales/build-dictionary';
import { useDatasets } from '../../datasets';
import { HomePageMenu } from './menu';
import { Loading, PageTitle, Row, SearchableList } from '../../../components';
import { useTitle } from '../../../utils/hooks/useTitle';
import { PartialDataset } from '../../../model/Dataset';

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
