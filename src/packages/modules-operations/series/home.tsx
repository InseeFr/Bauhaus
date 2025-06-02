import { Row } from '@components/layout';
import { FeminineButton } from '@components/new-button';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';
import { VerticalMenu } from '@components/vertical-menu';

import { useTitle } from '@utils/hooks/useTitle';

import { HasAccess } from '../../auth/components/auth';
import D from '../../deprecated-locales';
import { Series } from '../../model/Series';

function SeriesHome({ series }: Readonly<{ series: Series[] }>) {
	useTitle(D.operationsTitle, D.seriesTitle);

	return (
		<div className="container">
			<Row>
				<VerticalMenu>
					<HasAccess module="OPERATION_SERIES" privilege="CREATE">
						<FeminineButton action="/operations/series/create" />
					</HasAccess>
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right operations-list">
					<PageTitle title={D.seriesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={series}
						childPath="operations/series"
						label="label"
						searchUrl="/operations/series/search"
						advancedSearch={true}
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
}

export default SeriesHome;
