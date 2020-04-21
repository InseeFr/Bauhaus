import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle, SearchableList } from '@inseefr/wilco';
import Controls from './controls';
import D from 'js/i18n';
import { CheckSecondLang } from 'bauhaus-utilities';

const ClassificationTree = ({ items, subtitle, classificationId }) => {
	return (
		<div>
			<div className="container">
				<PageTitle title={D.classificationAllItemsTitle} subtitle={subtitle} />
				<Controls />
				<CheckSecondLang />

				{items.length !== 0 && (
					<div className="row">
						<div className="col-md-8 col-md-offset-2 text-center">
							<SearchableList
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
