import { useState, useEffect } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { Link } from 'react-router-dom';
import D from '../../deprecated-locales';
import { PageTitle, Row } from '../../components';

import { useGoBack } from '../../utils/hooks/useGoBack';

import './tree.scss';
import { useTitle } from '../../utils/hooks/useTitle';
import { OperationsApi } from '../../sdk/operations-api';
import { ActionToolbar } from '../../components/action-toolbar';
import { ReturnButton } from '../../components/buttons/buttons-with-icons';

export const formatLeaf = (
	leaf,
	index,
	parent,
	baseURL,
	canHaveChildren = true
) => {
	return {
		...leaf,
		index,
		parent,
		childrenFetched: false,
		children: canHaveChildren && [{}],
		url: baseURL + leaf.id,
	};
};

export const updateParent = (
	leaf,
	children,
	path,
	canHaveGrantChildren = true
) => {
	return {
		...leaf,
		expanded: true,
		childrenFetched: true,
		children: children.map((d, index) =>
			formatLeaf(d, index, leaf.index, path, canHaveGrantChildren)
		),
	};
};

export const updateTree = (treeData, leaf, familyIndex, seriesIndex) => {
	return treeData.map((data, i) => {
		if (i === familyIndex) {
			if (!(seriesIndex >= 0)) {
				return leaf;
			} else {
				return {
					...data,
					children: data.children.map((data, i) => {
						if (i === seriesIndex) {
							return leaf;
						}
						return data;
					}),
				};
			}
		}
		return data;
	});
};

const TreeComponent = () => {
	useTitle(D.operationsTitle, D.operationsTreeTitle);

	const [treeData, setTreeData] = useState([]);
	const [selectedLeaf, setSelectedLeaf] = useState({});

	const goBack = useGoBack();

	useEffect(() => {
		OperationsApi.getAllFamilies().then((data) => {
			setTreeData(
				data.map((d, index) =>
					formatLeaf(d, index, undefined, '/operations/family/')
				)
			);
		});
	}, []);

	useEffect(() => {
		if (selectedLeaf.node) {
			const { treeData, node, expanded, path } = selectedLeaf;
			const isFamily = path.length === 1;
			const isSeries = path.length === 2;

			const familyIndex = node.parent || node.index;
			const seriesIndex = node.parent && node.index;

			if (expanded && !node.childrenFetched) {
				if (isFamily) {
					OperationsApi.getFamilyById(node.id).then(({ series = [] }) => {
						setTreeData(
							updateTree(
								treeData,
								updateParent(node, series, '/operations/series/'),
								familyIndex,
								seriesIndex
							)
						);
					});
				} else if (isSeries) {
					OperationsApi.getSerie(node.id).then(({ operations = [] }) => {
						const updateNode = updateParent(
							node,
							operations,
							'/operations/operation/',
							false
						);

						setTreeData(
							updateTree(treeData, updateNode, familyIndex, seriesIndex)
						);
					});
				}
			}
		}
	}, [selectedLeaf]);

	return (
		<div className="container">
			<PageTitle title={D.operationsTreeTitle} col={12} offset={0} />
			<ActionToolbar>
				<ReturnButton action={() => goBack('/operations')} />
			</ActionToolbar>
			<Row>
				<div className="col-md-12 text-center pull-right operations-list">
					<div style={{ height: '100vh' }}>
						<SortableTree
							treeData={treeData}
							onChange={(treeData) => setTreeData(treeData)}
							onVisibilityToggle={(visibilityToggleEvent) => {
								setSelectedLeaf(visibilityToggleEvent);
							}}
							canDrag={false}
							canDrop={() => false}
							canNodeHaveChildren={() => true}
							generateNodeProps={(rowInfo) => ({
								buttons: [
									rowInfo.node.url && (
										<Link to={rowInfo.node.url}>
											{rowInfo.node.label || rowInfo.node.labelLg1}
										</Link>
									),
								],
							})}
						/>
					</div>
				</div>
			</Row>
		</div>
	);
};

export default TreeComponent;
