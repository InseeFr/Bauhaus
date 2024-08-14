import D from '../../i18n';
import {
	PageTitle,
	Row,
	SearchableList,
} from '../../new-architecture/components';
import { Menu } from './menu';
import { useTitle } from '../../new-architecture/utils/hooks/useTitle';

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
