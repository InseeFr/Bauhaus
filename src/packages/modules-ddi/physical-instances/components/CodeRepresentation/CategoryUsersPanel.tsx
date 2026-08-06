import { useState } from "react";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Tree } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { CategoryUsage } from "../../types/api";
import { buildCategoryUsersTree, type CategoryUsersNodeData } from "./categoryUsersTree";

const PHYSICAL_INSTANCE_PATH = "/ddi/physical-instances";
const linkStyle = { textDecoration: "none", color: "inherit" } as const;

interface CategoryUsersPanelProps {
  /** Usages de la catégorie : listes de codes avec leurs variables / StudyUnit / Group. */
  usages: CategoryUsage[];
  title: string;
  help: string;
  /** Identifiant unique pour la cible du tooltip d'aide. */
  tooltipTargetId: string;
  /** Déplie le panneau au premier rendu (popup dédiée aux utilisations, par exemple). */
  defaultOpened?: boolean;
}

const collectExpandedKeys = (nodes: TreeNode[]): Record<string, boolean> => {
  const keys: Record<string, boolean> = {};
  const visit = (node: TreeNode) => {
    if (node.children && node.children.length > 0) {
      keys[String(node.key)] = true;
      node.children.forEach(visit);
    }
  };
  nodes.forEach(visit);
  return keys;
};

/**
 * Panneau repliable listant TOUTES les listes de codes qui utilisent la même catégorie (y
 * compris celle en cours d'édition), en arbre Group > StudyUnit > Variable > CodeList. Purement
 * présentational : les usages sont fournis par l'appelant. Rien n'est rendu quand il n'y a rien
 * à montrer.
 */
export const CategoryUsersPanel = ({
  usages,
  title,
  help,
  tooltipTargetId,
  defaultOpened = false,
}: Readonly<CategoryUsersPanelProps>) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(defaultOpened);

  const tree = buildCategoryUsersTree(usages, {
    unknownGroup: t("physicalInstance.view.code.categoryUsersPanel.unknownGroup"),
    unknownStudyUnit: t("physicalInstance.view.code.usersPanel.unknownStudyUnit"),
  });

  const helpTooltipTarget = tooltipTargetId.replace(/[^a-zA-Z0-9_-]/g, "-");

  // En-tête personnalisé : pas de bouton "+/−" par défaut, l'ouverture/fermeture se fait en
  // cliquant sur l'en-tête, et l'icône "?" porte l'explication (tooltip au survol).
  const headerTemplate = (options: PanelHeaderTemplateOptions) => (
    <div className={`${options.className} cursor-pointer`} onClick={options.onTogglerClick}>
      <Tooltip target={`.${helpTooltipTarget}`} position="left" />
      <span className={options.titleClassName}>{title}</span>
      <i
        className={`pi pi-question-circle ${helpTooltipTarget}`}
        data-pr-tooltip={help}
        style={{ cursor: "help" }}
        aria-label={help}
      />
    </div>
  );

  // PhysicalInstance et Variable sont des liens vers la page de la PI ; pour la variable on
  // cible en plus la variable via le query parameter `variableId` (la page l'ouvre au chargement).
  const nodeTemplate = (node: TreeNode) => {
    const data = node.data as CategoryUsersNodeData | undefined;
    if (data?.kind === "physicalInstance") {
      return (
        <Link
          to={`${PHYSICAL_INSTANCE_PATH}/${data.agencyId}/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          {node.label}
        </Link>
      );
    }
    if (data?.kind === "variable" && data.physicalInstanceAgencyId && data.physicalInstanceId) {
      return (
        <Link
          to={
            `${PHYSICAL_INSTANCE_PATH}/${data.physicalInstanceAgencyId}/${data.physicalInstanceId}` +
            `?variableId=${encodeURIComponent(data.variableId)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          {node.label}
        </Link>
      );
    }
    return <span>{node.label}</span>;
  };

  // Le bloc n'apparaît que s'il y a d'autres utilisations à montrer.
  if (tree.length === 0) {
    return null;
  }

  return (
    <Panel
      headerTemplate={headerTemplate}
      toggleable
      collapsed={!opened}
      onToggle={(e) => setOpened(!e.value)}
    >
      <Tree
        value={tree}
        nodeTemplate={nodeTemplate}
        expandedKeys={collectExpandedKeys(tree)}
        className="w-full border-none p-0"
      />
    </Panel>
  );
};
