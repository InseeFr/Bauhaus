import { useState } from "react";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Tree } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { CodeListUsage } from "../../types/api";
import { buildCodeListUsersTree, type CodeListUsersNodeData } from "./codeListUsersTree";

const PHYSICAL_INSTANCE_PATH = "/ddi/physical-instances";
const linkStyle = { textDecoration: "none", color: "inherit" } as const;

interface UsersPanelProps {
  /** Usages (variable + PI + StudyUnit) à afficher — ceux d'une CodeList ou d'une MMVR. */
  usages: CodeListUsage[];
  /** Variable en cours d'édition : exclue de l'arbre pour ne pas se lister elle-même. */
  currentVariableId?: string;
  title: string;
  help: string;
  /** Identifiant unique pour la cible du tooltip d'aide. */
  tooltipTargetId: string;
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
 * Panneau repliable listant les <em>autres</em> Variable / PhysicalInstance / StudyUnit qui
 * réutilisent le même item (CodeList ou ManagedMissingValuesRepresentation), en arbre
 * StudyUnit > PhysicalInstance > Variable. Purement présentational : les usages sont fournis par
 * l'appelant. Rien n'est rendu quand il n'y a rien à montrer.
 */
export const UsersPanel = ({
  usages,
  currentVariableId,
  title,
  help,
  tooltipTargetId,
}: Readonly<UsersPanelProps>) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const tree = buildCodeListUsersTree(
    usages.filter((usage) => usage.variableId !== currentVariableId),
    { unknownStudyUnit: t("physicalInstance.view.code.usersPanel.unknownStudyUnit") },
  );

  const helpTooltipTarget = tooltipTargetId.replace(/[^a-zA-Z0-9_-]/g, "-");

  // En-tête personnalisé : pas de bouton "+/−" par défaut, l'ouverture/fermeture se fait en cliquant
  // sur l'en-tête, et l'icône "?" porte l'explication (tooltip au survol).
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

  // PhysicalInstance et Variable sont des liens vers la page de la PI ; pour la variable on cible
  // en plus la variable via le query parameter `variableId` (la page l'ouvre au chargement).
  const nodeTemplate = (node: TreeNode) => {
    const data = node.data as CodeListUsersNodeData | undefined;
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
    if (data?.kind === "variable") {
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
