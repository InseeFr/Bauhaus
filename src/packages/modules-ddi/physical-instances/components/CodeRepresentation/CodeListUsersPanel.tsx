import { useState } from "react";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Tree } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useCodeListUsers } from "../../../hooks/useCodeListUsers";
import { buildCodeListUsersTree, type CodeListUsersNodeData } from "./codeListUsersTree";

const PHYSICAL_INSTANCE_PATH = "/ddi/physical-instances";
const linkStyle = { textDecoration: "none", color: "inherit" } as const;

interface CodeListUsersPanelProps {
  agencyId: string;
  id: string;
  /** Variable currently being edited: excluded from the list so it doesn't list itself. */
  currentVariableId?: string;
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
 * Collapsible panel listing every <em>other</em> Variable / PhysicalInstance / StudyUnit that reuses
 * the same code list, as a StudyUnit > PhysicalInstance > Variable tree. The variable currently being
 * edited is excluded. Nothing is rendered while loading, on error, or when the code list has no other
 * user — the block only appears when there is something to show. A "?" header icon explains it.
 */
export const CodeListUsersPanel = ({
  agencyId,
  id,
  currentVariableId,
}: Readonly<CodeListUsersPanelProps>) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const { data: usages = [], isLoading, isError } = useCodeListUsers(agencyId, id);

  const tree = buildCodeListUsersTree(
    usages.filter((usage) => usage.variableId !== currentVariableId),
    { unknownStudyUnit: t("physicalInstance.view.code.usersPanel.unknownStudyUnit") },
  );

  const helpTooltipTarget = `cl-users-help-${agencyId}-${id}`.replace(/[^a-zA-Z0-9_-]/g, "-");

  // En-tête personnalisé : pas de bouton "+/−" par défaut, l'ouverture/fermeture se fait en cliquant
  // sur l'en-tête, et l'icône "?" porte l'explication (tooltip au survol).
  const headerTemplate = (options: PanelHeaderTemplateOptions) => (
    <div className={`${options.className} cursor-pointer`} onClick={options.onTogglerClick}>
      <Tooltip target={`.${helpTooltipTarget}`} position="left" />
      <span className={options.titleClassName}>
        {t("physicalInstance.view.code.usersPanel.title")}
      </span>
      <i
        className={`pi pi-question-circle ${helpTooltipTarget}`}
        data-pr-tooltip={t("physicalInstance.view.code.usersPanel.help")}
        style={{ cursor: "help" }}
        aria-label={t("physicalInstance.view.code.usersPanel.help")}
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
  if (isLoading || isError || tree.length === 0) {
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
