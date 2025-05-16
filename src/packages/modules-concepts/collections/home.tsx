import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../deprecated-locales';
import { PartialCollection } from '../../model/concepts/collection';
import { Menu } from './menu';

interface CollectionsHomeTypes {
	collections: PartialCollection[];
}

const CollectionsHome = ({ collections }: Readonly<CollectionsHomeTypes>) => {
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
						autoFocus
					/>
				</div>
			</Row>
		</div>
	);
};

export default CollectionsHome;
