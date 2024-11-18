import { PageTitle } from '@components/page-title';
import D from '../../../deprecated-locales';

import { CheckSecondLang } from '@components/check-second-lang';
import { Row } from '@components/layout';
import { SearchableList } from '@components/searchable-list';
import Controls from './controls';

const ClassificationTree = ({ items, subtitle, classificationId }) => {
	return (
		<div>
			<div className="container">
				<PageTitle title={D.classificationAllItemsTitle} subtitle={subtitle} />
				<Controls />
				<CheckSecondLang />

				{items.length !== 0 && (
					<Row>
						<div className="col-md-8 col-md-offset-2 text-center">
							<SearchableList
								items={items}
								childPath={`classifications/classification/${classificationId}/item`}
							/>
						</div>
					</Row>
				)}
			</div>
		</div>
	);
};

export default ClassificationTree;
