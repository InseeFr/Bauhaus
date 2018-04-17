import React from 'react';
import PropTypes from 'prop-types';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import DnDTree from 'js/components/shared/tree/dnd';
import D from 'js/i18n';

const ClassificationTree = ({
	data,
	prefLabel,
	secondLang,
	saveSecondLang,
}) => {
	return (
		<div>
			<div className="container">
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />
				<PageTitle
					title={D.classificationTreeTitle}
					subtitle={prefLabel}
					context="classifications"
				/>
				<Controls />
				<div className="row">
					<div className="col-md-12">
						<DnDTree treeData={data} linkPath={id => `item/${id}`} />
					</div>
				</div>
			</div>
		</div>
	);
};

ClassificationTree.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			parent: PropTypes.string,
		}).isRequired
	),
	prefLabel: PropTypes.string.isRequired,
	secondLang: PropTypes.bool.isRequired,
	saveSecondLang: PropTypes.func.isRequired,
};

export default ClassificationTree;
