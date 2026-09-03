import type { TreeNode } from "primereact/treenode";

import type { CategoryUsage, UsageItem } from "../../types/api";

export interface CategoryUsersTreeLabels {
  /** Label du nœud racine quand un usage n'a pas de Group résolvable. */
  unknownGroup: string;
  /** Label du nœud quand un usage n'a pas de StudyUnit résolvable. */
  unknownStudyUnit: string;
}

/**
 * Porté par {@link TreeNode.data}, permet au panneau de transformer un nœud en lien. Les nœuds
 * Group / StudyUnit / CodeList ne sont pas navigables ; les nœuds PhysicalInstance et Variable
 * pointent vers la page de la PhysicalInstance (la Variable se cible en plus via le query
 * parameter {@code variableId}).
 */
export type CategoryUsersNodeData =
  | { kind: "group" }
  | { kind: "studyUnit" }
  | { kind: "physicalInstance"; agencyId: string; id: string }
  | {
      kind: "variable";
      physicalInstanceAgencyId: string | null;
      physicalInstanceId: string | null;
      variableId: string;
    }
  | { kind: "codeList" };

const itemLabel = (item: UsageItem) => (item.label?.trim() ? item.label : item.id);

const itemKey = (item: UsageItem) => `${item.agencyId}/${item.id}`;

const byLabel = (a: TreeNode, b: TreeNode) =>
  String(a.label ?? "").localeCompare(String(b.label ?? ""));

/**
 * Regroupe les lignes plates d'usages d'une catégorie en arbre
 * Group / StudyUnit / PhysicalInstance / Variable / CodeList pour le {@code Tree} PrimeReact.
 * Les lignes partageant un nœud parent fusionnent sous celui-ci ; une liste sans variable
 * utilisatrice est rattachée directement à la StudyUnit (elle-même « inconnue » si irrésolvable),
 * le niveau PhysicalInstance étant omis quand il est irrésolvable. Chaque niveau est trié par
 * libellé ; les libellés manquants retombent sur l'identifiant.
 */
export const buildCategoryUsersTree = (
  usages: readonly CategoryUsage[],
  labels: CategoryUsersTreeLabels,
): TreeNode[] => {
  const groups = new Map<string, TreeNode>();
  const nodesByKey = new Map<string, TreeNode>();

  const childOf = (parent: TreeNode | null, key: string, create: () => TreeNode): TreeNode => {
    let node = nodesByKey.get(key);
    if (!node) {
      node = { ...create(), key, children: [] };
      nodesByKey.set(key, node);
      if (parent) {
        parent.children!.push(node);
      } else {
        groups.set(key, node);
      }
    }
    return node;
  };

  for (const { group, studyUnit, physicalInstance, variable, codeList } of usages) {
    const groupKey = group ? `grp:${itemKey(group)}` : "grp:none";
    const groupNode = childOf(null, groupKey, () => ({
      label: group ? itemLabel(group) : labels.unknownGroup,
      icon: "pi pi-folder",
      data: { kind: "group" } satisfies CategoryUsersNodeData,
    }));

    const suKey = studyUnit ? `${groupKey}|su:${itemKey(studyUnit)}` : `${groupKey}|su:none`;
    const suNode = childOf(groupNode, suKey, () => ({
      label: studyUnit ? itemLabel(studyUnit) : labels.unknownStudyUnit,
      icon: "pi pi-book",
      data: { kind: "studyUnit" } satisfies CategoryUsersNodeData,
    }));

    // Niveau PhysicalInstance, omis quand il est irrésolvable.
    const piParent = physicalInstance
      ? childOf(suNode, `${suKey}|pi:${itemKey(physicalInstance)}`, () => ({
          label: itemLabel(physicalInstance),
          icon: "pi pi-database",
          data: {
            kind: "physicalInstance",
            agencyId: physicalInstance.agencyId,
            id: physicalInstance.id,
          } satisfies CategoryUsersNodeData,
        }))
      : suNode;

    // Liste sans variable utilisatrice : rattachée directement au parent disponible.
    const codeListParent = variable
      ? childOf(piParent, `${String(piParent.key)}|var:${itemKey(variable)}`, () => ({
          label: itemLabel(variable),
          icon: "pi pi-tag",
          data: {
            kind: "variable",
            physicalInstanceAgencyId: physicalInstance?.agencyId ?? null,
            physicalInstanceId: physicalInstance?.id ?? null,
            variableId: variable.id,
          } satisfies CategoryUsersNodeData,
        }))
      : piParent;

    childOf(codeListParent, `${String(codeListParent.key)}|cl:${itemKey(codeList)}`, () => ({
      label: itemLabel(codeList),
      icon: "pi pi-list",
      data: { kind: "codeList" } satisfies CategoryUsersNodeData,
    }));
  }

  const sortDeep = (nodes: TreeNode[]) => {
    nodes.sort(byLabel);
    for (const node of nodes) {
      if (node.children) {
        sortDeep(node.children);
      }
    }
  };
  const roots = [...groups.values()];
  sortDeep(roots);
  return roots;
};
