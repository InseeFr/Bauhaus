import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";
import { GlobalActionToolbar } from "./GlobalActionToolbar";
import { PhysicalInstancesDataTable } from "./PhysicalInstancesDataTable";

interface GlobalActionsCardProps {
  variables: any[];
  onExport: (format: "DDI3" | "DDI4") => void;
  onDuplicate?: () => void;
  /** Outil de mise au point : le bouton n'est rendu qu'en local. */
  onValidateDdi4?: () => void;
  onRowClick?: (data: any) => void;
  onDeleteClick?: (data: any) => void;
  unsavedVariableIds?: string[];
  selectedVariableId?: string | null;
  /** Stamps de l'instance source — gating STAMP du bouton de duplication. */
  stamps?: string[];
}

export const GlobalActionsCard = ({
  variables,
  onExport,
  onDuplicate,
  onValidateDdi4,
  onRowClick,
  onDeleteClick,
  unsavedVariableIds = [],
  selectedVariableId,
  stamps,
}: Readonly<GlobalActionsCardProps>) => {
  const { t } = useTranslation();

  return (
    <Card title={t("physicalInstance.view.globalActions")}>
      <GlobalActionToolbar
        onExport={onExport}
        onDuplicate={onDuplicate}
        onValidateDdi4={onValidateDdi4}
        stamps={stamps}
      />
      <PhysicalInstancesDataTable
        variables={variables}
        onRowClick={onRowClick}
        onDeleteClick={onDeleteClick}
        unsavedVariableIds={unsavedVariableIds}
        selectedVariableId={selectedVariableId}
      />
    </Card>
  );
};
