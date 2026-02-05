import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";

interface PhysicalInstancesDataTableProps {
  variables: any[];
  onRowClick?: (data: any) => void;
  onDeleteClick?: (data: any) => void;
  unsavedVariableIds?: string[];
}

export const PhysicalInstancesDataTable = ({
  variables,
  onRowClick,
  onDeleteClick,
  unsavedVariableIds = [],
}: Readonly<PhysicalInstancesDataTableProps>) => {
  const { t, i18n } = useTranslation();

  const rowClassName = (rowData: any) => {
    return unsavedVariableIds.includes(rowData.id) ? "font-italic" : "";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      // Vérifier que la date est valide
      if (isNaN(date.getTime())) return "";

      return new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch {
      return "";
    }
  };

  const dateBodyTemplate = (rowData: any) => {
    return formatDate(rowData.lastModified);
  };

  const deleteBodyTemplate = (rowData: any) => (
    <Button
      icon="pi pi-trash"
      rounded
      text
      severity="danger"
      onClick={(e) => {
        e.stopPropagation();
        onDeleteClick?.(rowData);
      }}
      aria-label={t("physicalInstance.view.delete")}
    />
  );

  const footer = t("physicalInstance.view.totalVariables", { count: variables.length });

  return (
    <DataTable
      value={variables}
      stripedRows
      aria-label={t("physicalInstance.view.variablesTable")}
      onRowClick={(e) => onRowClick?.(e.data)}
      selectionMode="single"
      rowClassName={rowClassName}
      footer={footer}
    >
      <Column field="name" header={t("physicalInstance.view.columns.name")} />
      <Column field="label" header={t("physicalInstance.view.columns.label")} />
      <Column field="type" header={t("physicalInstance.view.columns.type")} />
      <Column
        field="lastModified"
        header={t("physicalInstance.view.columns.lastModified")}
        body={dateBodyTemplate}
      />
      <Column body={deleteBodyTemplate} style={{ width: "5rem" }} />
    </DataTable>
  );
};
