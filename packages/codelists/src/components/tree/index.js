import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

const RmesTree = (props) => {
	const [treeData, setTreeData] = useState(props.treeData);

	return (
		<div style={{ width: '100%', height: '80vh' }}>
			<SortableTree
				treeData={treeData}
				onChange={(treeData) => setTreeData(treeData)}
				canDrag={() => false}
				canDrop={() => false}
				generateNodeProps={(rowInfo) => ({
					buttons: [
						<Link to={props.linkPath(rowInfo.node.id)}>
							{rowInfo.node.label}
						</Link>,
					],
				})}
			/>
		</div>
	);
};

export default RmesTree;
