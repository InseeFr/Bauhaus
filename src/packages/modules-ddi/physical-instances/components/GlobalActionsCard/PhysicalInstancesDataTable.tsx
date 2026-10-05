import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@components/ui/button";
import { DataTable } from "@components/ui/data-table";
import { Column } from "@components/ui/table-column";

interface PhysicalInstancesDataTableProps {
  variables: any[];
  onRowClick?: (data: any) => void;
  onDeleteClick?: (data: any) => void;
  unsavedVariableIds?: string[];
  /** Variables signalées en erreur par la validation globale (#1608). */
  invalidVariableIds?: string[];
  selectedVariableId?: string | null;
}

export const PhysicalInstancesDataTable = ({
  variables,
  onRowClick,
  onDeleteClick,
  unsavedVariableIds = [],
  invalidVariableIds = [],
  selectedVariableId,
}: Readonly<PhysicalInstancesDataTableProps>) => {
  const { t, i18n } = useTranslation();

  const rowClassName = (rowData: any) => {
    const classes: string[] = [];
    if (unsavedVariableIds.includes(rowData.id)) {
      classes.push("font-italic");
    }
    if (rowData.id === selectedVariableId) {
      classes.push("selected-variable-row");
    }
    return classes.join(" ");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      // Vérifier que la date est valide
      if (Number.isNaN(date.getTime())) return "";

      return new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch {
      return "";
    }
  };

  // Le marqueur d'erreur est porté par la ligne : PrimeReact ne redessine une cellule que si sa
  // donnée change, pas quand seul le gabarit `body` change.
  const rows = useMemo(
    () =>
      invalidVariableIds.length === 0
        ? variables
        : variables.map((variable) =>
            invalidVariableIds.includes(variable.id) ? { ...variable, hasErrors: true } : variable,
          ),
    [variables, invalidVariableIds],
  );

  const nameBodyTemplate = (rowData: any) => (
    <>
      {rowData.name}
      {rowData.hasErrors && (
        <i
          className="pi pi-exclamation-circle variable-error-indicator"
          role="img"
          aria-label={t("physicalInstance.view.validation.variableHasErrors")}
          title={t("physicalInstance.view.validation.variableHasErrors")}
        />
      )}
    </>
  );

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

  const header = t("physicalInstance.view.totalVariables", {
    count: variables.length,
  });

  return (
    <DataTable
      value={rows}
      stripedRows
      aria-label={t("physicalInstance.view.variablesTable")}
      onRowClick={(e) => onRowClick?.(e.data)}
      selectionMode="single"
      rowClassName={rowClassName}
      header={header}
    >
      <Column
        field="name"
        header={t("physicalInstance.view.columns.name")}
        body={nameBodyTemplate}
        sortable
      />
      <Column field="label" header={t("physicalInstance.view.columns.label")} sortable />
      <Column field="type" header={t("physicalInstance.view.columns.type")} sortable />
      <Column
        field="lastModified"
        header={t("physicalInstance.view.columns.lastModified")}
        body={dateBodyTemplate}
        sortable
      />
      <Column body={deleteBodyTemplate} style={{ width: "5rem" }} />
    </DataTable>
  );
};
