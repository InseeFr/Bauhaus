import { useState } from 'react';
import { Link } from 'react-router-dom';
import SortableTree, { TreeItem } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import './dnd.scss';

type TreeTypes = {
	treeData: Array<TreeItem<any>>;
	canDrag?: boolean;
	linkPath: (id: string) => string;
};
export const Tree = ({ treeData, canDrag, linkPath }: TreeTypes) => {
	const [tree, setTree] = useState<Array<TreeItem<any>>>(treeData);

	return (
		<div style={{ width: '100%', height: '80vh' }}>
			<SortableTree
				treeData={tree}
				onChange={(treeData) => setTree(treeData)}
				canDrag={canDrag || false}
				canDrop={() => false}
				generateNodeProps={(rowInfo) => ({
					buttons: [
						<Link key={rowInfo.node.id} to={linkPath(rowInfo.node.id)}>
							{rowInfo.node.label}
						</Link>,
					],
				})}
			/>
		</div>
	);
};
