import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import D from 'js/i18n';
import { CheckSecondLang, Row, SearchableList } from 'js/utils';

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
