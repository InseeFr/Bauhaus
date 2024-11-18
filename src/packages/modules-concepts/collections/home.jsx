import D from '../../deprecated-locales';
import { Menu } from './menu';
import { useTitle } from '../../utils/hooks/useTitle';
import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

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
