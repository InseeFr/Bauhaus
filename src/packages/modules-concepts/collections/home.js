import D from '../../deprecated-locales';
import { PageTitle, Row, SearchableList } from '../../components';
import { Menu } from './menu';
import { useTitle } from '../../utils/hooks/useTitle';

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
