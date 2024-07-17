import D from '../../i18n';
import { SearchableList, useTitle } from '../../utils';
import { PageTitle, Row } from '../../new-architecture/components';
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
						childPath="collection"
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};

export default CollectionsHome;
