import React, { useState } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import D from '../../i18n/build-dictionary';

const RmesTree = (props) => {
	const [treeData, setTreeData] = useState(props.treeData);

	console.log(treeData);
	console.log(props.treeData);
	return (
		<div style={{ width: '100%', height: '80vh' }}>
			<SortableTree
				treeData={treeData}
				onChange={(treeData) => setTreeData(treeData)}
				canDrag={!props.readOnly}
				canDrop={() => !props.readOnly}
				generateNodeProps={(rowInfo) => ({
					buttons: [
						<button
							data-component-id={rowInfo.node.id}
							onClick={props.seeClickHandler}
							aria-label={D.see}
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
