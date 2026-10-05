import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";
import { LoadingErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { Tree, TreeEventNodeEvent } from "@components/ui/tree";
import { TreeNode } from "@components/ui/tree-node";

import { serieQuery } from "@utils/hooks/series";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { familyQuery, useFamilies } from "../../../hooks/useFamilies";
import "./tree.css";

interface FamilyItem {
  id: string;
  label?: string;
  labelLg1?: string;
}

interface SeriesItem {
  id: string;
  label?: string;
  labelLg1?: string;
}

interface OperationItem {
  id: string;
  label?: string;
  labelLg1?: string;
}

type TreeNodeType = "family" | "series" | "operation";

interface TreeNodeData {
  id: string;
  type: TreeNodeType;
  familyId?: string;
  seriesId?: string;
}

const formatFamily = (family: FamilyItem): TreeNode => {
  return {
    key: `family-${family.id}`,
    label: family.label || family.labelLg1,
    data: { ...family, type: "family" },
    leaf: false,
    children: [],
  };
};

const formatSeries = (series: SeriesItem, familyId: string): TreeNode => {
  return {
    key: `series-${series.id}`,
    label: series.label || series.labelLg1,
    data: { ...series, type: "series", familyId },
    leaf: false,
    children: [],
  };
};

const formatOperation = (operation: OperationItem, seriesId: string): TreeNode => {
  return {
    key: `operation-${operation.id}`,
    label: operation.label || operation.labelLg1,
    data: { ...operation, type: "operation", seriesId },
    leaf: true,
  };
};

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("tree.title"));

  const { data: families, isLoading, error } = useFamilies();

  const queryClient = useQueryClient();

  // Enfants chargés au dépliage, par clé du nœud parent.
  const [childrenByKey, setChildrenByKey] = useState<Record<string, TreeNode[]>>({});

  const [loadingNodes, setLoadingNodes] = useState<Set<TreeNode["key"]>>(() => new Set());

  const [expandError, setExpandError] = useState<unknown>();

  const goBack = useGoBack();

  const treeData = useMemo(() => {
    const withChildren = (node: TreeNode): TreeNode => {
      const children = childrenByKey[node.key as string];
      return children ? { ...node, children: children.map(withChildren) } : node;
    };
    return (families ?? []).map((family) => withChildren(formatFamily(family)));
  }, [families, childrenByKey]);

  const loadChildren = (nodeData: TreeNodeData): Promise<TreeNode[]> => {
    if (nodeData.type === "family") {
      return queryClient
        .fetchQuery(familyQuery(nodeData.id))
        .then(({ series = [] }) => series.map((s) => formatSeries(s, nodeData.id)));
    }
    return queryClient
      .fetchQuery(serieQuery<{ operations?: OperationItem[] }>(nodeData.id))
      .then(({ operations = [] }) => operations.map((o) => formatOperation(o, nodeData.id)));
  };

  const onExpand = (event: TreeEventNodeEvent) => {
    const node = event.node;
    const nodeData = node.data as TreeNodeData;
    if (nodeData.type === "operation" || (node.children && node.children.length > 0)) {
      return;
    }
    setExpandError(undefined);
    setLoadingNodes((prev) => new Set(prev).add(node.key));
    loadChildren(nodeData)
      .then((children) => setChildrenByKey((prev) => ({ ...prev, [node.key as string]: children })))
      .catch(setExpandError)
      .finally(() =>
        setLoadingNodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(node.key);
          return newSet;
        }),
      );
  };

  const nodeTemplate = (node: TreeNode) => {
    const nodeData = node.data as TreeNodeData;
    let linkPath = "";
    switch (nodeData.type) {
      case "family":
        linkPath = `/operations/family/${nodeData.id}`;
        break;
      case "series":
        linkPath = `/operations/series/${nodeData.id}`;
        break;
      case "operation":
        linkPath = `/operations/operation/${nodeData.id}`;
        break;
      default:
        return <span>{node.label}</span>;
    }
    return (
      <Link to={linkPath} style={{ textDecoration: "none", color: "inherit" }}>
        {node.label}
      </Link>
    );
  };

  if (isLoading) return <Loading />;

  if (error) return <LoadingErrorBloc error={error} />;

  return (
    <div className="container">
      <PageTitle title={t("tree.title")} col={12} offset={0} />
      <ActionToolbar>
        <ReturnButton action={() => goBack("/operations")} />
      </ActionToolbar>
      {expandError !== undefined && <LoadingErrorBloc error={expandError} />}
      <Row>
        <div className="col-md-12 text-center pull-right operations-list">
          <div style={{ height: "100vh" }}>
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
