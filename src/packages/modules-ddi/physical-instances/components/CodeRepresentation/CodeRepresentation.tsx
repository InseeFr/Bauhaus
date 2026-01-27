import { useReducer, useEffect } from "react";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Category,
} from "../../types/api";
import { ReuseCodeListSelect } from "./ReuseCodeListSelect";
import { CodeListDataTable, CodeTableRow } from "./CodeListDataTable";
import { codeRepresentationReducer, initialState } from "./CodeRepresentation.reducer";
import {
  createDefaultRepresentation,
  createDefaultCodeList,
  createCode,
  createCategory,
  createLabel,
} from "./CodeRepresentation.utils";
import { useAppContext } from "../../../../application/app-context";

interface CodeRepresentationProps {
  representation?: CodeRepresentationType;
  codeList?: CodeList;
  categories?: Category[];
  onChange: (
    representation: CodeRepresentationType | undefined,
    codeList?: CodeList,
    categories?: Category[],
  ) => void;
}

export const CodeRepresentation = ({
  representation,
  codeList,
  categories = [],
  onChange,
}: Readonly<CodeRepresentationProps>) => {
  const { t } = useTranslation();
  const { properties } = useAppContext();
  const defaultAgencyId = properties.defaultAgencyId;
  const [state, dispatch] = useReducer(codeRepresentationReducer, {
    ...initialState,
    codeListLabel: codeList?.Label?.Content?.["#text"] || "",
  });

  const { codeListLabel, codes, showDataTable, showReuseSelect, selectedCodeListId } = state;

  useEffect(() => {
    if (codeList) {
      // Cas où on a une codeList complète (création ou liste existante chargée)
      const tableData: CodeTableRow[] = (codeList.Code || []).map((code) => {
        const category = categories.find((cat) => cat.ID === code.CategoryReference.ID);
        return {
          id: code.ID,
          value: code.Value,
          label: category?.Label?.Content?.["#text"] || "",
          categoryId: category?.ID || "",
        };
      });
      dispatch({
        type: "INIT_FROM_CODE_LIST",
        payload: {
          label: codeList.Label?.Content?.["#text"] || "",
          codes: tableData,
          showDataTable: true,
        },
      });
    } else if (representation?.CodeListReference) {
      // Cas où on a une representation qui référence une codeList réutilisée
      // (pas de codeList car elle n'est pas dupliquée, juste référencée)
      const ref = representation.CodeListReference;
      const selectedId = `${ref.Agency}-${ref.ID}`;
      dispatch({
        type: "INIT_REUSED_CODE_LIST",
        payload: { selectedCodeListId: selectedId },
      });
    } else {
      dispatch({
        type: "INIT_FROM_CODE_LIST",
        payload: {
          label: "",
          codes: [],
          showDataTable: false,
        },
      });
    }
    // Only react to changes in codeList ID or representation reference, not label changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeList?.ID, representation?.CodeListReference?.ID]);

  const handleCodeListLabelChange = (newLabel: string) => {
    dispatch({ type: "SET_CODE_LIST_LABEL", payload: newLabel });

    const newCodeListId = codeList?.ID || crypto.randomUUID();
    const currentRepresentation =
      representation || createDefaultRepresentation(newCodeListId, defaultAgencyId);
    const updatedCodeList: CodeList = {
      ...(codeList || createDefaultCodeList(newCodeListId, newLabel, defaultAgencyId)),
      Label: createLabel(newLabel),
    };

    onChange(currentRepresentation, updatedCodeList, categories);
  };

  const handleDeleteCode = (codeId: string) => {
    const deletedCode = codes.find((c) => c.id === codeId);
    dispatch({ type: "DELETE_CODE", payload: codeId });

    const newCodeListId = codeList?.ID || crypto.randomUUID();
    const currentRepresentation =
      representation || createDefaultRepresentation(newCodeListId, defaultAgencyId);
    const updatedCodeList: CodeList = {
      ...(codeList || createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId)),
      Code: codeList?.Code?.filter((code) => code.ID !== codeId),
    };

    const updatedCategories = deletedCode
      ? categories.filter((cat) => cat.ID !== deletedCode.categoryId)
      : categories;

    onChange(currentRepresentation, updatedCodeList, updatedCategories);
  };

  const handleCellEdit = (rowData: CodeTableRow, field: "value" | "label", newValue: string) => {
    dispatch({
      type: "UPDATE_CODE",
      payload: { id: rowData.id, field, value: newValue },
    });

    const updatedCode = {
      ...rowData,
      [field]: newValue,
    };

    const newCodeListId = codeList?.ID || crypto.randomUUID();
    const currentRepresentation =
      representation || createDefaultRepresentation(newCodeListId, defaultAgencyId);
    const newCategory = createCategory(updatedCode.categoryId, updatedCode.label, defaultAgencyId);
    const newCode = createCode(
      updatedCode.id,
      updatedCode.categoryId,
      updatedCode.value,
      defaultAgencyId,
    );

    const existingCode = codeList?.Code?.find((c) => c.ID === rowData.id);
    let updatedCodeListCodes;
    let updatedCategories: Category[];

    if (existingCode) {
      updatedCodeListCodes =
        codeList?.Code?.map((code) => (code.ID === rowData.id ? newCode : code)) || [];
      updatedCategories = categories.map((cat) =>
        cat.ID === rowData.categoryId ? newCategory : cat,
      );
    } else {
      updatedCodeListCodes = [...(codeList?.Code || []), newCode];
      updatedCategories = [...categories, newCategory];
    }

    const updatedCodeList: CodeList = {
      ...(codeList || createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId)),
      Code: updatedCodeListCodes,
    };

    onChange(currentRepresentation, updatedCodeList, updatedCategories);
  };

  const handleAddCode = (value: string, label: string) => {
    const newRow: CodeTableRow = {
      id: crypto.randomUUID(),
      value,
      label,
      categoryId: crypto.randomUUID(),
      isNew: true,
    };

    dispatch({ type: "ADD_CODE", payload: newRow });

    const newCodeListId = codeList?.ID || crypto.randomUUID();
    const currentRepresentation =
      representation || createDefaultRepresentation(newCodeListId, defaultAgencyId);
    const newCategory = createCategory(newRow.categoryId, newRow.label, defaultAgencyId);
    const newCode = createCode(newRow.id, newRow.categoryId, newRow.value, defaultAgencyId);

    const updatedCodeList: CodeList = {
      ...(codeList || createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId)),
      Code: [...(codeList?.Code || []), newCode],
    };

    onChange(currentRepresentation, updatedCodeList, [...categories, newCategory]);
  };

  const handleMoveCode = (codeId: string, direction: "up" | "down") => {
    dispatch({ type: "MOVE_CODE", payload: { id: codeId, direction } });

    const currentIndex = codes.findIndex((c) => c.id === codeId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= codes.length) return;

    const newCodeListId = codeList?.ID || crypto.randomUUID();
    const currentRepresentation =
      representation || createDefaultRepresentation(newCodeListId, defaultAgencyId);

    // Réorganiser les codes dans la codeList
    const currentCodes = [...(codeList?.Code || [])];
    const [movedCode] = currentCodes.splice(currentIndex, 1);
    currentCodes.splice(newIndex, 0, movedCode);

    const updatedCodeList: CodeList = {
      ...(codeList || createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId)),
      Code: currentCodes,
    };

    onChange(currentRepresentation, updatedCodeList, categories);
  };

  return (
    <div className="flex flex-column gap-2">
      <div className="flex gap-2">
        <Button
          type="button"
          icon="pi pi-plus"
          label={t("physicalInstance.view.code.createNewList")}
          outlined
          onClick={() => {
            dispatch({ type: "SHOW_DATA_TABLE" });
            // Ajouter automatiquement une ligne vide si la liste est vide
            if (codes.length === 0) {
              handleAddCode("", "");
            }
          }}
        />
        <Button
          type="button"
          icon="pi pi-sync"
          label={t("physicalInstance.view.code.reuseList")}
          outlined
          onClick={() => dispatch({ type: "TOGGLE_REUSE_SELECT" })}
        />
      </div>
      {showReuseSelect && (
        <ReuseCodeListSelect
          selectedCodeListId={selectedCodeListId}
          onCodeListSelect={(id) => {
            dispatch({ type: "SET_SELECTED_CODE_LIST_ID", payload: id });

            // Extraire l'agency et l'ID de la liste de codes depuis la valeur combinée "agency-id"
            const [agency, ...idParts] = id.split("-");
            const codeListId = idParts.join("-");

            // Créer la CodeRepresentation qui référence la liste de codes réutilisée
            const codeRepresentation = createDefaultRepresentation(codeListId, agency);

            // Appeler onChange avec uniquement la CodeRepresentation (pas de codeList ni categories
            // car on réutilise une liste existante)
            onChange(codeRepresentation, undefined, undefined);
          }}
        />
      )}
      {showDataTable && (
        <CodeListDataTable
          codeListLabel={codeListLabel}
          codes={codes}
          onCodeListLabelChange={handleCodeListLabelChange}
          onCellEdit={handleCellEdit}
          onDeleteCode={handleDeleteCode}
          onAddCode={handleAddCode}
          onMoveCode={handleMoveCode}
        />
      )}
    </div>
  );
};
