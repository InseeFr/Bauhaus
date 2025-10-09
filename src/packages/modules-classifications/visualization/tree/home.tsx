import { useParams, Link } from 'react-router-dom';

import { CheckSecondLang } from '@components/check-second-lang';
import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { Tree } from 'primereact/tree';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales';
import Controls from './controls';
import { TreeNode } from 'primereact/treenode';

const ClassificationTree = ({
	data,
	prefLabel,
	secondLang,
}: Readonly<{
	data: { id: string; labelLg1: string; labelLg2: string; parent?: string }[];
	prefLabel: string;
	secondLang: boolean;
}>) => {
	const { id } = useParams();

	useTitle(
		D.classificationsTitle,
		D.classificationTreeTitle + ': ' + prefLabel,
	);

	const convertToTreeNodes = (
		items: {
			id: string;
			labelLg1: string;
			labelLg2: string;
			parent?: string;
		}[],
	): TreeNode[] => {
		const itemMap = new Map<string, TreeNode>();
		const rootNodes: TreeNode[] = [];
		const processedIds = new Set<string>();

		for (const item of items) {
			if (!processedIds.has(item.id)) {
				const node: TreeNode = {
					key: item.id,
					label: secondLang ? item.labelLg2 : item.labelLg1,
					data: item,
					children: [],
					expanded: false,
				};
				itemMap.set(item.id, node);
				processedIds.add(item.id);
			}
		}

		for (const item of items) {
			const node = itemMap.get(item.id);
			if (node) {
				if (item.parent && itemMap.has(item.parent)) {
					const parentNode = itemMap.get(item.parent);
					if (parentNode && parentNode.children) {
						const alreadyExists = parentNode.children.some(
							(child) => child.key === node.key,
						);
						if (!alreadyExists) {
							parentNode.children.push(node);
						}
					}
				} else {
					const alreadyExists = rootNodes.some((root) => root.key === node.key);
					if (!alreadyExists) {
						rootNodes.push(node);
					}
				}
			}
		}

		const sortTreeNodes = (nodes: TreeNode[]): TreeNode[] => {
			return nodes
				.sort((a, b) => (a.label ?? '').localeCompare(b.label ?? ''))
				.map((node) => ({
					...node,
					children: node.children ? sortTreeNodes(node.children) : [],
				}));
		};

		return sortTreeNodes(rootNodes);
	};

	const treeData = convertToTreeNodes(data);

	const nodeTemplate = (node: TreeNode) => {
		const nodeData = node.data as {
			id: string;
			labelLg1: string;
			labelLg2: string;
			parent?: string;
		};
		const linkPath = `/classifications/classification/${id}/item/${nodeData.id}`;

		return (
			<Link to={linkPath} style={{ textDecoration: 'none', color: 'inherit' }}>
				{node.label}
			</Link>
		);
	};

	return (
		<div>
			<div className="container">
				<PageTitle title={D.classificationTreeTitle} subtitle={prefLabel} />
				<Controls />
				<CheckSecondLang />

				{data.length !== 0 && (
					<Row>
						<Tree value={treeData} nodeTemplate={nodeTemplate} />
					</Row>
				)}
			</div>
		</div>
	);
};

export default ClassificationTree;
