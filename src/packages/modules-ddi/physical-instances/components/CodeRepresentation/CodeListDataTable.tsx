import { useRef, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "primereact/menuitem";

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
  const menuRefs = useRef<Map<string, Menu | null>>(new Map());
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

  const getMenuItems = (rowData: CodeTableRow, index: number): MenuItem[] => {
    const items: MenuItem[] = [];

    if (onMoveCode && index > 0) {
      items.push({
        label: t("physicalInstance.view.code.moveUp"),
        icon: "pi pi-arrow-up",
        command: () => onMoveCode(rowData.id, "up"),
      });
    }

    if (onMoveCode && index < codes.length - 1) {
      items.push({
        label: t("physicalInstance.view.code.moveDown"),
        icon: "pi pi-arrow-down",
        command: () => onMoveCode(rowData.id, "down"),
      });
    }

    items.push({
      label: t("physicalInstance.view.code.deleteCode"),
      icon: "pi pi-trash",
      className: "p-menuitem-danger",
      command: () => onDeleteCode(rowData.id),
    });

    return items;
  };

  const actionBodyTemplate = (rowData: CodeTableRow, options: { rowIndex: number }) => {
    const menuRef = (el: Menu | null) => {
      menuRefs.current.set(rowData.id, el);
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
      // Fermer tous les autres menus avant d'ouvrir celui-ci
      menuRefs.current.forEach((menu, id) => {
        if (id !== rowData.id && menu) {
          menu.hide(e);
        }
      });
      menuRefs.current.get(rowData.id)?.toggle(e);
    };

    return (
      <div className="flex gap-2">
        <Menu model={getMenuItems(rowData, options.rowIndex)} popup ref={menuRef} />
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
      <DataTable value={codes} size="small" emptyMessage={t("physicalInstance.view.code.noCodes")}>
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
