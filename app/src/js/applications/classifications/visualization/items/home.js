import React from 'react';
import PropTypes from 'prop-types';
import { CheckSecondLang, PageTitle, SearchRmes } from '@inseefr/ui';
import Controls from './controls';
import D from 'js/i18n';

const ClassificationTree = ({
	items,
	subtitle,
	classificationId,
	secondLang,
	saveSecondLang,
}) => {
	return (
		<div>
			<div className="container">
				<PageTitle title={D.classificationAllItemsTitle} subtitle={subtitle} />
				<Controls />
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

				{items.length !== 0 && (
					<div className="row">
						<div className="col-md-8 col-md-offset-2 centered">
							<SearchRmes
								items={items}
								childPath={`classifications/classification/${classificationId}/item`}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

ClassificationTree.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
	classificationId: PropTypes.string.isRequired,
};

export default ClassificationTree;
