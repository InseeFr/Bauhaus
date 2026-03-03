import { useParams, Link } from "react-router-dom";

import { CheckSecondLang } from "@components/check-second-lang";
import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { Tree } from "primereact/tree";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../deprecated-locales";
import Controls from "./controls";
import { TreeNode } from "primereact/treenode";

type ClassificationItem = {
  id: string;
  labelLg1: string;
  labelLg2: string;
  parent?: string;
};

const sortTreeNodes = (nodes: TreeNode[]): TreeNode[] => {
  return nodes
    .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""))
    .map((node) => ({
      ...node,
      children: node.children ? sortTreeNodes(node.children) : [],
    }));
};

const buildItemMap = (items: ClassificationItem[], secondLang: boolean): Map<string, TreeNode> => {
  const itemMap = new Map<string, TreeNode>();

  for (const item of items) {
    if (!itemMap.has(item.id)) {
      itemMap.set(item.id, {
        key: item.id,
        label: secondLang ? item.labelLg2 : item.labelLg1,
        data: item,
        children: [],
        expanded: false,
      });
    }
  }

  return itemMap;
};

const addNodeToParentOrRoot = (
  node: TreeNode,
  item: ClassificationItem,
  itemMap: Map<string, TreeNode>,
  rootNodes: TreeNode[],
): void => {
  const parentNode = item.parent ? itemMap.get(item.parent) : undefined;

  if (parentNode?.children) {
    const alreadyExists = parentNode.children.some((child) => child.key === node.key);
    if (!alreadyExists) {
      parentNode.children.push(node);
    }
  } else {
    const alreadyExists = rootNodes.some((root) => root.key === node.key);
    if (!alreadyExists) {
      rootNodes.push(node);
    }
  }
};

const convertToTreeNodes = (items: ClassificationItem[], secondLang: boolean): TreeNode[] => {
  const itemMap = buildItemMap(items, secondLang);
  const rootNodes: TreeNode[] = [];

  for (const item of items) {
    const node = itemMap.get(item.id);
    if (node) {
      addNodeToParentOrRoot(node, item, itemMap, rootNodes);
    }
  }

  return sortTreeNodes(rootNodes);
};

const ClassificationTree = ({
  data,
  prefLabel,
  secondLang,
}: Readonly<{
  data: ClassificationItem[];
  prefLabel: string;
  secondLang: boolean;
}>) => {
  const { id } = useParams();

  useTitle(D.classificationsTitle, D.classificationTreeTitle + ": " + prefLabel);

  const treeData = convertToTreeNodes(data, secondLang);

  const nodeTemplate = (node: TreeNode) => {
    const nodeData = node.data as ClassificationItem;
    const linkPath = `/classifications/classification/${id}/item/${nodeData.id}`;

    return (
      <Link to={linkPath} style={{ textDecoration: "none", color: "inherit" }}>
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
