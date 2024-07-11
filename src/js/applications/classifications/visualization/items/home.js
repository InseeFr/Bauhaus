import { PageTitle, Row } from 'js/new-architecture/components';
import Controls from './controls';
import D from 'js/i18n';
import { CheckSecondLang, SearchableList } from 'js/utils';

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
