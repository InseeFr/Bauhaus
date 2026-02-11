import { useRef, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
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
  onMoveCode?: (codeId: string, direction: "up" | "down") => void;
}

export const CodeListDataTable = ({
  codeListLabel,
  codes,
  onCodeListLabelChange,
  onCellEdit,
  onDeleteCode,
  onAddCode,
  onMoveCode,
}: Readonly<CodeListDataTableProps>) => {
  const { t } = useTranslation();
  const overlayRefs = useRef<Map<string, OverlayPanel | null>>(new Map());
  const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());
  const [shouldFocusNewCode, setShouldFocusNewCode] = useState(false);
  const previousCodesLength = useRef(codes.length);

  useEffect(() => {
    if (shouldFocusNewCode && codes.length > previousCodesLength.current) {
      const lastCode = codes[codes.length - 1];
      if (lastCode) {
        const inputElement = inputRefs.current.get(lastCode.id);
        if (inputElement) {
          inputElement.focus();
        }
      }
      setShouldFocusNewCode(false);
    }
    previousCodesLength.current = codes.length;
  }, [codes, shouldFocusNewCode]);

  const handleAddCode = () => {
    setShouldFocusNewCode(true);
    onAddCode("", "");
  };

  const valueEditor = (rowData: CodeTableRow) => {
    return (
      <InputText
        type="text"
        value={rowData.value}
        onChange={(e) => onCellEdit(rowData, "value", e.target.value)}
        placeholder={t("physicalInstance.view.code.value")}
        className="w-full"
        aria-label={t("physicalInstance.view.code.value")}
        ref={(el) => {
          if (el) {
            inputRefs.current.set(rowData.id, el);
          }
        }}
      />
    );
  };

  const labelEditor = (rowData: CodeTableRow) => {
    return (
      <InputText
        type="text"
        value={rowData.label}
        onChange={(e) => onCellEdit(rowData, "label", e.target.value)}
        placeholder={t("physicalInstance.view.code.label")}
        className="w-full"
        aria-label={t("physicalInstance.view.code.label")}
      />
    );
  };

  const actionBodyTemplate = (rowData: CodeTableRow) => {
    const overlayRef = (el: OverlayPanel | null) => {
      overlayRefs.current.set(rowData.id, el);
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
      e.stopPropagation();

      // Fermer tous les autres menus avant d'ouvrir celui-ci
      overlayRefs.current.forEach((overlay, id) => {
        if (id !== rowData.id && overlay) {
          overlay.hide();
        }
      });

      overlayRefs.current.get(rowData.id)?.toggle(e);
    };

    // Always recalculate index from current codes array
    const currentIndex = codes.findIndex((c) => c.id === rowData.id);
    const canMoveUp = onMoveCode && currentIndex > 0;
    const canMoveDown = onMoveCode && currentIndex < codes.length - 1;

    return (
      <div className="flex gap-2">
        <OverlayPanel ref={overlayRef}>
          <div className="flex flex-column gap-2" style={{ minWidth: "200px" }}>
            {canMoveUp && (
              <Button
                type="button"
                label={t("physicalInstance.view.code.moveUp")}
                icon="pi pi-arrow-up"
                text
                onClick={() => {
                  onMoveCode(rowData.id, "up");
                  overlayRefs.current.get(rowData.id)?.hide();
                }}
              />
            )}
            {canMoveDown && (
              <Button
                type="button"
                label={t("physicalInstance.view.code.moveDown")}
                icon="pi pi-arrow-down"
                text
                onClick={() => {
                  onMoveCode(rowData.id, "down");
                  overlayRefs.current.get(rowData.id)?.hide();
                }}
              />
            )}
            <Button
              type="button"
              label={t("physicalInstance.view.code.deleteCode")}
              icon="pi pi-trash"
              text
              severity="danger"
              onClick={() => {
                onDeleteCode(rowData.id);
                overlayRefs.current.get(rowData.id)?.hide();
              }}
            />
          </div>
        </OverlayPanel>
        <Button
          type="button"
          icon="pi pi-ellipsis-v"
          rounded
          text
          onClick={handleMenuToggle}
          aria-haspopup="true"
          aria-label={t("physicalInstance.view.code.actionsMenu")}
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-column gap-2">
        <label htmlFor="code-list-label">{t("physicalInstance.view.code.codeListLabel")}</label>
        <InputText
          id="code-list-label"
          name="codeListLabel"
          autoComplete="off"
          value={codeListLabel}
          onChange={(e) => onCodeListLabelChange(e.target.value)}
        />
      </div>
      <DataTable
        value={codes}
        size="small"
        emptyMessage={t("physicalInstance.view.code.noCodes")}
        dataKey="id"
        key={codes.map((c) => c.id).join("-")}
      >
        <Column
          field="value"
          header={t("physicalInstance.view.code.value")}
          body={(rowData) => valueEditor(rowData)}
        />
        <Column
          field="label"
          header={t("physicalInstance.view.code.label")}
          body={(rowData) => labelEditor(rowData)}
        />
        <Column
          body={(rowData, options) => actionBodyTemplate(rowData, options)}
          style={{ width: "5rem" }}
        />
      </DataTable>
      <Button
        type="button"
        icon="pi pi-plus"
        label={t("physicalInstance.view.code.addCode")}
        outlined
        onClick={handleAddCode}
        className="mt-2"
      />
    </>
  );
};
