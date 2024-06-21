import { useState } from 'react';
import { Link } from 'react-router-dom';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import './dnd.scss';

const RmesTree = ({ treeData, canDrag, linkPath }) => {
	const [tree, setTree] = useState(treeData);

	return (
		<div style={{ width: '100%', height: '80vh' }}>
			<SortableTree
				treeData={tree}
				onChange={(treeData) => setTree(treeData)}
				canDrag={canDrag || false}
				canDrop={() => false}
				generateNodeProps={(rowInfo) => ({
					buttons: [
						<Link to={linkPath(rowInfo.node.id)}>{rowInfo.node.label}</Link>,
					],
				})}
			/>
		</div>
	);
};

export default RmesTree;
