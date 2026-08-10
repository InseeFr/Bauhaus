import { useRef, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { useTranslation } from "react-i18next";

import "./CodeListDataTable.css";

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
  /** Pendant de {@link onCellCommit} pour le libellé de la liste. */
  onCodeListLabelCommit?: (values: { value: string; previousValue: string }) => Promise<boolean>;
  /** Frappe en cours : l'état local se met à jour immédiatement, sans rien décider. */
  onCellEdit: (rowData: CodeTableRow, field: "value" | "label", newValue: string) => void;
  /**
   * Demande la décision sur une cellule éditée : appelé à la PREMIÈRE frappe d'une session
   * d'édition, la modification étant déjà appliquée. Reçoit la valeur saisie et celle d'avant
   * l'édition, pour pouvoir restaurer cette dernière si l'utilisateur renonce. Résout à `true`
   * quand une popup a interrompu l'utilisateur, auquel cas le focus lui est rendu.
   */
  onCellCommit?: (
    rowData: CodeTableRow,
    field: "value" | "label",
    values: { value: string; previousValue: string },
  ) => Promise<boolean>;
  onDeleteCode: (codeId: string) => void;
  onAddCode: (value: string, label: string) => void;
  onMoveCode?: (codeId: string, direction: "up" | "down") => void;
  /** Ouvre les usages de la catégorie du code ; l'entrée de menu est masquée sans ce handler. */
  onShowCategoryUsage?: (rowData: CodeTableRow) => void;
  readOnly?: boolean;
}

export const CodeListDataTable = ({
  codeListLabel,
  codes,
  onCodeListLabelChange,
  onCodeListLabelCommit,
  onCellEdit,
  onCellCommit,
  onDeleteCode,
  onAddCode,
  onMoveCode,
  onShowCategoryUsage,
  readOnly = false,
}: Readonly<CodeListDataTableProps>) => {
  const { t } = useTranslation();
  // Grise les champs d'une liste réutilisée (mutualisée) pour signaler qu'ils ne sont pas éditables.
  const readOnlyClassName = readOnly ? "code-list-readonly-input" : "";
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

  /**
   * Champs dont l'édition en cours a déjà été soumise à la garde. Une session d'édition ne pose
   * la question qu'une fois : les frappes suivantes s'appliquent sans repasser par elle.
   */
  const guardedFields = useRef<Set<string>>(new Set());
  /**
   * Champ dont la décision est en cours de résolution. La garde étant asynchrone, la saisie y est
   * gelée le temps de la réponse : sans cela, les caractères tapés entre-temps ne seraient pas
   * couverts par la décision et disparaîtraient à la création d'une variante.
   */
  const [fieldAwaitingDecision, setFieldAwaitingDecision] = useState<string | null>(null);
  const cellKey = (rowId: string, field: "value" | "label") => `${rowId}:${field}`;
  const LABEL_KEY = "code-list-label";

  /**
   * Soumet à la garde la PREMIÈRE frappe d'une session d'édition, la modification étant déjà
   * appliquée. Le focus n'est repris que si la garde signale une interruption (popup) : sinon,
   * déplacer le focus serait gratuit.
   */
  const guardFirstEdit = async (
    key: string,
    element: HTMLInputElement,
    ask: () => Promise<boolean> | undefined,
  ) => {
    if (guardedFields.current.has(key)) {
      return;
    }
    guardedFields.current.add(key);
    setFieldAwaitingDecision(key);
    try {
      if (await ask()) {
        element.focus();
        // Décision prise : une prochaine édition de ce champ repart d'une base neuve.
        guardedFields.current.delete(key);
      }
    } finally {
      setFieldAwaitingDecision(null);
    }
  };

  const handleCellChange = (
    rowData: CodeTableRow,
    field: "value" | "label",
    element: HTMLInputElement,
  ) => {
    const previousValue = rowData[field];
    const value = element.value;
    onCellEdit(rowData, field, value);
    void guardFirstEdit(cellKey(rowData.id, field), element, () =>
      onCellCommit?.(rowData, field, { value, previousValue }),
    );
  };

  const handleCodeListLabelChange = (element: HTMLInputElement) => {
    const previousValue = codeListLabel;
    const value = element.value;
    onCodeListLabelChange(value);
    void guardFirstEdit(LABEL_KEY, element, () =>
      onCodeListLabelCommit?.({ value, previousValue }),
    );
  };

  /** Câblage commun aux deux cellules éditables : frappe appliquée, décision demandée aussitôt. */
  const editorProps = (rowData: CodeTableRow, field: "value" | "label") => ({
    type: "text",
    value: rowData[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleCellChange(rowData, field, e.target),
    placeholder: t(`physicalInstance.view.code.${field}`),
    className: `w-full ${readOnlyClassName}`.trim(),
    "aria-label": t(`physicalInstance.view.code.${field}`),
    readOnly: readOnly || fieldAwaitingDecision === cellKey(rowData.id, field),
  });

  const valueEditor = (rowData: CodeTableRow) => (
    <InputText
      {...editorProps(rowData, "value")}
      ref={(el) => {
        if (el) {
          inputRefs.current.set(rowData.id, el);
        }
      }}
    />
  );

  const labelEditor = (rowData: CodeTableRow) => <InputText {...editorProps(rowData, "label")} />;

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
            {onShowCategoryUsage && (
              <Button
                type="button"
                label={t("physicalInstance.view.code.categoryUsage.menuEntry")}
                icon="pi pi-sitemap"
                text
                onClick={() => {
                  onShowCategoryUsage(rowData);
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
          autoFocus
          value={codeListLabel}
          onChange={(e) => handleCodeListLabelChange(e.target)}
          readOnly={readOnly || fieldAwaitingDecision === LABEL_KEY}
          className={readOnlyClassName || undefined}
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
        {!readOnly && (
          <Column body={(rowData) => actionBodyTemplate(rowData)} style={{ width: "5rem" }} />
        )}
      </DataTable>
      {!readOnly && (
        <Button
          type="button"
          icon="pi pi-plus"
          label={t("physicalInstance.view.code.addCode")}
          outlined
          onClick={handleAddCode}
          className="mt-2"
        />
      )}
    </>
  );
};
