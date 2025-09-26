import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tree } from 'primereact/tree';

import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';
import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';

import { OperationsApi } from '@sdk/operations-api';

import { useGoBack } from '@utils/hooks/useGoBack';
import { useTitle } from '@utils/hooks/useTitle';

import D from '../../deprecated-locales';
import './tree.css';

const formatFamily = (family) => {
	return {
		key: `family-${family.id}`,
		label: family.label || family.labelLg1,
		data: { ...family, type: 'family' },
		leaf: false,
		children: [],
	};
};

const formatSeries = (series, familyId) => {
	return {
		key: `series-${series.id}`,
		label: series.label || series.labelLg1,
		data: { ...series, type: 'series', familyId },
		leaf: false,
		children: [],
	};
};

const formatOperation = (operation, seriesId) => {
	return {
		key: `operation-${operation.id}`,
		label: operation.label || operation.labelLg1,
		data: { ...operation, type: 'operation', seriesId },
		leaf: true,
	};
};

export const Component = () => {
	useTitle(D.operationsTitle, D.operationsTreeTitle);

	const [treeData, setTreeData] = useState([]);
	const [loadingNodes, setLoadingNodes] = useState(new Set());

	const goBack = useGoBack();

	useEffect(() => {
		OperationsApi.getAllFamilies().then((data) => {
			setTreeData(data.map(formatFamily));
		});
	}, []);

	const onExpand = (event) => {
		const node = event.node;
		const nodeData = node.data;

		if (node.children && node.children.length > 0) {
			return;
		}

		setLoadingNodes((prev) => new Set(prev).add(node.key));

		if (nodeData.type === 'family') {
			OperationsApi.getFamilyById(nodeData.id).then(({ series = [] }) => {
				const updatedTreeData = [...treeData];
				const familyNode = findNodeByKey(updatedTreeData, node.key);
				if (familyNode) {
					familyNode.children = series.map((s) => formatSeries(s, nodeData.id));
				}
				setTreeData(updatedTreeData);
				setLoadingNodes((prev) => {
					const newSet = new Set(prev);
					newSet.delete(node.key);
					return newSet;
				});
			});
		} else if (nodeData.type === 'series') {
			OperationsApi.getSerie(nodeData.id).then(({ operations = [] }) => {
				const updatedTreeData = [...treeData];
				const seriesNode = findNodeByKey(updatedTreeData, node.key);
				if (seriesNode) {
					seriesNode.children = operations.map((o) =>
						formatOperation(o, nodeData.id),
					);
				}
				setTreeData(updatedTreeData);
				setLoadingNodes((prev) => {
					const newSet = new Set(prev);
					newSet.delete(node.key);
					return newSet;
				});
			});
		}
	};

	const findNodeByKey = (nodes, key) => {
		for (let node of nodes) {
			if (node.key === key) {
				return node;
			}
			if (node.children) {
				const found = findNodeByKey(node.children, key);
				if (found) return found;
			}
		}
		return null;
	};

	const nodeTemplate = (node) => {
		const nodeData = node.data;
		let linkPath = '';

		switch (nodeData.type) {
			case 'family':
				linkPath = `/operations/family/${nodeData.id}`;
				break;
			case 'series':
				linkPath = `/operations/series/${nodeData.id}`;
				break;
			case 'operation':
				linkPath = `/operations/operation/${nodeData.id}`;
				break;
			default:
				return <span>{node.label}</span>;
		}

		return (
			<Link to={linkPath} style={{ textDecoration: 'none', color: 'inherit' }}>
				{node.label}
			</Link>
		);
	};

	return (
		<div className="container">
			<PageTitle title={D.operationsTreeTitle} col={12} offset={0} />
			<ActionToolbar>
				<ReturnButton action={() => goBack('/operations')} />
			</ActionToolbar>
			<Row>
				<div className="col-md-12 text-center pull-right operations-list">
					<div style={{ height: '100vh' }}>
						<Tree
							value={treeData}
							onExpand={onExpand}
							nodeTemplate={nodeTemplate}
							loading={loadingNodes.size > 0}
						/>
					</div>
				</div>
			</Row>
		</div>
	);
};
