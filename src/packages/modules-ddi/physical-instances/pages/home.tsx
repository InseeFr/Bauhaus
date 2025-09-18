import { Row } from '@components/layout';
import { Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales';
import { usePhysicalInstances } from '../../hooks/usePhysicalInstances';

export const Component = () => {
	useTitle(D.ddiTitle, D.physicalInstanceTitle);
	const { data = [], isLoading } = usePhysicalInstances();

	if (isLoading) return <Loading />;

	return (
		<div className="container">
			<Row>
				<div className="col-md-8 text-center pull-right">
					<PageTitle
						title={D.physicalInstancSearcheTitle}
						col={12}
						offset={0}
					/>
					<SearchableList
						items={data}
						childPath="ddi/physical-instances"
						autoFocus
					/>
				</div>
			</Row>
		</div>
	);
};
