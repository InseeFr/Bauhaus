import React from 'react';
import PropTypes from 'prop-types';
import { CheckSecondLang, PageTitle } from 'bauhaus-library';
import Controls from './controls';
import DnDTree from 'js/applications/shared/tree/dnd';
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
				<PageTitle title={D.classificationTreeTitle} subtitle={prefLabel} />
				<Controls />
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

				{data.length !== 0 && (
					<div className="row">
						<div className="col-md-12">
							<DnDTree treeData={data} linkPath={id => `item/${id}`} />
						</div>
					</div>
				)}
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
