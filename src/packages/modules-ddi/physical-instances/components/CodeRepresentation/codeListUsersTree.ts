import type { TreeNode } from "primereact/treenode";

import type { CodeListUsage } from "../../types/api";

export interface CodeListUsersTreeLabels {
  /** Label used as the root node when a usage has no resolvable StudyUnit. */
  unknownStudyUnit: string;
}

/**
 * Carried on {@link TreeNode.data}, lets the panel turn a node into the right link. StudyUnit nodes
 * are not navigable; PhysicalInstance and Variable nodes link to the physical instance page (the
 * Variable additionally targets itself through the {@code variableId} query parameter).
 */
export type CodeListUsersNodeData =
  | { kind: "studyUnit" }
  | { kind: "physicalInstance"; agencyId: string; id: string }
  | {
      kind: "variable";
      physicalInstanceAgencyId: string;
      physicalInstanceId: string;
      variableId: string;
    };

const itemLabel = (label: string | null, fallbackId: string) =>
  label && label.trim() !== "" ? label : fallbackId;

const byLabel = (a: TreeNode, b: TreeNode) =>
  String(a.label ?? "").localeCompare(String(b.label ?? ""));

/**
 * Groups the flat usage rows into a StudyUnit / PhysicalInstance / Variable tree for PrimeReact's
 * {@code Tree}. Rows sharing a StudyUnit collapse under one root node; rows sharing a
 * PhysicalInstance collapse under one PI node. Each level is sorted alphabetically by label so the
 * output is deterministic. Missing labels fall back to the item identifier (or the provided
 * {@code unknownStudyUnit} label for a StudyUnit-less usage).
 */
export const buildCodeListUsersTree = (
  usages: readonly CodeListUsage[],
  labels: CodeListUsersTreeLabels,
): TreeNode[] => {
  const studyUnits = new Map<string, TreeNode>();
  // Per StudyUnit, track its PhysicalInstance nodes by key so siblings merge.
  const physicalInstancesBySu = new Map<string, Map<string, TreeNode>>();

  for (const usage of usages) {
    const suKey = usage.studyUnitId
      ? `su:${usage.studyUnitAgencyId}/${usage.studyUnitId}`
      : "su:none";

    let suNode = studyUnits.get(suKey);
    if (!suNode) {
      suNode = {
        key: suKey,
        label: usage.studyUnitId
          ? itemLabel(usage.studyUnitLabel, usage.studyUnitId)
          : labels.unknownStudyUnit,
        icon: "pi pi-book",
        data: { kind: "studyUnit" },
        children: [],
      };
      studyUnits.set(suKey, suNode);
      physicalInstancesBySu.set(suKey, new Map());
    }

    const piKey = `${suKey}|pi:${usage.physicalInstanceAgencyId}/${usage.physicalInstanceId}`;
    const piNodes = physicalInstancesBySu.get(suKey)!;
    let piNode = piNodes.get(piKey);
    if (!piNode) {
      piNode = {
        key: piKey,
        label: itemLabel(usage.physicalInstanceLabel, usage.physicalInstanceId),
        icon: "pi pi-database",
        data: {
          kind: "physicalInstance",
          agencyId: usage.physicalInstanceAgencyId,
          id: usage.physicalInstanceId,
        },
        children: [],
      };
      piNodes.set(piKey, piNode);
      suNode.children!.push(piNode);
    }

    const varKey = `${piKey}|var:${usage.variableAgencyId}/${usage.variableId}`;
    if (!piNode.children!.some((child) => child.key === varKey)) {
      piNode.children!.push({
        key: varKey,
        label: itemLabel(usage.variableLabel, usage.variableId),
        icon: "pi pi-tag",
        data: {
          kind: "variable",
          physicalInstanceAgencyId: usage.physicalInstanceAgencyId,
          physicalInstanceId: usage.physicalInstanceId,
          variableId: usage.variableId,
        },
      });
    }
  }

  const roots = [...studyUnits.values()];
  for (const su of roots) {
    su.children!.sort(byLabel);
    for (const pi of su.children!) {
      pi.children?.sort(byLabel);
    }
  }
  roots.sort(byLabel);
  return roots;
};
