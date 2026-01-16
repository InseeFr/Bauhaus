import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";
import { GlobalActionToolbar } from "./GlobalActionToolbar";
import { PhysicalInstancesDataTable } from "./PhysicalInstancesDataTable";

interface GlobalActionsCardProps {
  variables: any[];
  onExport: (format: "DDI3" | "DDI4") => void;
  onDuplicate?: () => void;
  onRowClick?: (data: any) => void;
  onDeleteClick?: (data: any) => void;
  unsavedVariableIds?: string[];
  selectedVariableId?: string | null;
}

export const GlobalActionsCard = ({
  variables,
  onExport,
  onDuplicate,
  onRowClick,
  onDeleteClick,
  unsavedVariableIds = [],
  selectedVariableId,
}: Readonly<GlobalActionsCardProps>) => {
  const { t } = useTranslation();

  return (
    <Card title={t("physicalInstance.view.globalActions")}>
      <GlobalActionToolbar onExport={onExport} onDuplicate={onDuplicate} />
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
