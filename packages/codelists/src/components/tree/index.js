import React from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import D from '../../i18n/build-dictionary';

import './tree.scss';

const RmesTree = (props) => {
	return (
		<div style={{ width: '100%', height: '80vh' }}>
			<SortableTree
				treeData={props.treeData}
				onChange={props.handleChangeTree}
				canDrag={!props.readOnly}
				canDrop={() => !props.readOnly}
				generateNodeProps={(rowInfo) => ({
					buttons: [
						<button
							className="code-tree-detail"
							data-component-id={rowInfo.node.code}
							onClick={props.seeClickHandler}
							aria-label={D.see}
							type="button"
						>
							<span className="glyphicon glyphicon-eye-open"></span>
						</button>,
					],
				})}
			/>
		</div>
	);
};

export default RmesTree;
