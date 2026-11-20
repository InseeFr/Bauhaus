import { useTranslation } from "react-i18next";

import { Card } from "@components/ui/card";

import { GlobalActionToolbar } from "./GlobalActionToolbar";
import { PhysicalInstancesDataTable } from "./PhysicalInstancesDataTable";

interface GlobalActionsCardProps {
  variables: any[];
  onExport: (format: "DDI3" | "DDI4") => void;
  /** Outil de mise au point : le bouton n'est rendu qu'en local. */
  onValidateDdi4?: () => void;
  onRowClick?: (data: any) => void;
  onDeleteClick?: (data: any) => void;
  unsavedVariableIds?: string[];
  /** Variables signalées en erreur par la validation globale (#1608). */
  invalidVariableIds?: string[];
  /** Variables partagées avec d'autres fichiers de l'étude (#1387). */
  sharedVariableIds?: string[];
  selectedVariableId?: string | null;
  /** Stamps de l'instance — gating STAMP des suppressions. */
  stamps?: string[];
  /** Parents introuvables : aucun bouton menant à une sauvegarde. */
  readOnly?: boolean;
}

export const GlobalActionsCard = ({
  variables,
  onExport,
  onValidateDdi4,
  onRowClick,
  onDeleteClick,
  unsavedVariableIds = [],
  invalidVariableIds = [],
  sharedVariableIds = [],
  selectedVariableId,
  stamps,
  readOnly,
}: Readonly<GlobalActionsCardProps>) => {
  const { t } = useTranslation();

  return (
    <Card title={t("physicalInstance.view.globalActions")}>
      <GlobalActionToolbar onExport={onExport} onValidateDdi4={onValidateDdi4} />
      <PhysicalInstancesDataTable
        variables={variables}
        onRowClick={onRowClick}
        onDeleteClick={onDeleteClick}
        unsavedVariableIds={unsavedVariableIds}
        invalidVariableIds={invalidVariableIds}
        sharedVariableIds={sharedVariableIds}
        selectedVariableId={selectedVariableId}
        stamps={stamps}
        readOnly={readOnly}
      />
    </Card>
  );
};
