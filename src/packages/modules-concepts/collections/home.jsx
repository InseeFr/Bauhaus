import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import D from '../../deprecated-locales';
import { useTitle } from '../../utils/hooks/useTitle';
import { Menu } from './menu';

const CollectionsHome = ({ collections }) => {
	useTitle(D.conceptsTitle, D.collectionsTitle);
	return (
		<div className="container">
			<Row>
				<Menu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.collectionSearchTitle} col={12} offset={0} />
					<SearchableList
						items={collections}
						childPath="concepts/collections"
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};

export default CollectionsHome;
