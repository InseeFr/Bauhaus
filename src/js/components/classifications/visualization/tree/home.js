import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import DnDTree from 'js/components/shared/tree/dnd';
import D from 'js/i18n';
import { getTreeFromFlatData } from 'react-sortable-tree';

const ClassificationTree = ({ flatTree, prefLabelLg1 }) => {
	const data = getTreeFromFlatData({
		flatData: flatTree.map(n => ({
			...n,
			title: '',
			label: `${n.id} - ${n.title}`,
			parent: n.parent || null,
		})),
		getKey: node => node.id,
		getParentKey: node => node.parent,
		rootKey: null,
	});
	return (
		<div>
			<div className="container">
				<div className="row">
					<div className="col-md-8 col-md-offset-2 centered">
						<PageTitle
							title={D.classificationTreeTitle}
							subtitle={prefLabelLg1}
							col={12}
							offset={0}
							context="classifications"
						/>
					</div>
				</div>
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
	flatTree: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			parent: PropTypes.string,
		}).isRequired
	),
};

export default ClassificationTree;
