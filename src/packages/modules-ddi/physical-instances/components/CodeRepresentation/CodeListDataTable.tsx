import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";

export interface CodeTableRow {
  id: string;
  value: string;
  label: string;
  categoryId: string;
  isNew?: boolean;
}

interface CodeListDataTableProps {
  codeListLabel: string;
  codes: CodeTableRow[];
  onCodeListLabelChange: (label: string) => void;
  onCellEdit: (rowData: CodeTableRow, field: "value" | "label", newValue: string) => void;
  onDeleteCode: (codeId: string) => void;
  onAddCode: (value: string, label: string) => void;
}

export const CodeListDataTable = ({
  codeListLabel,
  codes,
  onCodeListLabelChange,
  onCellEdit,
  onDeleteCode,
  onAddCode,
}: Readonly<CodeListDataTableProps>) => {
  const { t } = useTranslation();
  const [emptyRowValue, setEmptyRowValue] = useState("");
  const [emptyRowLabel, setEmptyRowLabel] = useState("");

  const emptyRow: CodeTableRow = {
    id: "",
    value: emptyRowValue,
    label: emptyRowLabel,
    categoryId: "",
  };

  const handleAddCodeFromEmpty = () => {
    if (!emptyRowValue && !emptyRowLabel) return;
    onAddCode(emptyRowValue, emptyRowLabel);
    setEmptyRowValue("");
    setEmptyRowLabel("");
  };

  const valueEditor = (rowData: CodeTableRow) => {
    return (
      <InputText
        type="text"
        value={rowData.value}
        onChange={(e) => onCellEdit(rowData, "value", e.target.value)}
        className="w-full"
      />
    );
  };

  const labelEditor = (rowData: CodeTableRow) => {
    return (
      <InputText
        type="text"
        value={rowData.label}
        onChange={(e) => onCellEdit(rowData, "label", e.target.value)}
        className="w-full"
      />
    );
  };

  const actionBodyTemplate = (rowData: CodeTableRow) => {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => onDeleteCode(rowData.id)}
        />
      </div>
    );
  };

  const emptyRowValueTemplate = () => {
    return (
      <InputText
        type="text"
        value={emptyRowValue}
        onChange={(e) => setEmptyRowValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddCodeFromEmpty();
          }
        }}
        placeholder={t("physicalInstance.view.code.value")}
        className="w-full"
      />
    );
  };

  const emptyRowLabelTemplate = () => {
    return (
      <InputText
        type="text"
        value={emptyRowLabel}
        onChange={(e) => setEmptyRowLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddCodeFromEmpty();
          }
        }}
        placeholder={t("physicalInstance.view.code.label")}
        className="w-full"
      />
    );
  };

  const emptyRowActionTemplate = () => {
    const hasContent = emptyRowValue || emptyRowLabel;
    return (
      <Button
        type="button"
        icon="pi pi-plus"
        rounded
        text
        onClick={handleAddCodeFromEmpty}
        disabled={!hasContent}
        className="add-code-button"
        tooltip={
          hasContent
            ? t("physicalInstance.view.code.addCodeTooltip")
            : t("physicalInstance.view.code.fillFieldsTooltip")
        }
        tooltipOptions={{ position: "left" }}
      />
    );
  };

  return (
    <>
      <div className="flex flex-column gap-2">
        <label htmlFor="code-list-label">{t("physicalInstance.view.code.codeListLabel")}</label>
        <InputText
          id="code-list-label"
          name="codeListLabel"
          value={codeListLabel}
          onChange={(e) => onCodeListLabelChange(e.target.value)}
        />
      </div>
      <DataTable value={[...codes, emptyRow]} size="small">
        <Column
          field="value"
          header={t("physicalInstance.view.code.value")}
          body={(rowData) => (rowData.id === "" ? emptyRowValueTemplate() : valueEditor(rowData))}
        />
        <Column
          field="label"
          header={t("physicalInstance.view.code.label")}
          body={(rowData) => (rowData.id === "" ? emptyRowLabelTemplate() : labelEditor(rowData))}
        />
        <Column
          body={(rowData) =>
            rowData.id === "" ? emptyRowActionTemplate() : actionBodyTemplate(rowData)
          }
          style={{ width: "5rem" }}
        />
      </DataTable>
    </>
  );
};
