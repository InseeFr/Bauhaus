import { useReducer, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Category,
} from "../../types/api";
import { ReuseCodeListSelect } from "./ReuseCodeListSelect";
import { CodeListDataTable, CodeTableRow } from "./CodeListDataTable";
import { CodeListUsersPanel } from "./CodeListUsersPanel";
import { codeRepresentationReducer, initialState } from "./CodeRepresentation.reducer";
import {
  createDefaultRepresentation,
  createDefaultCodeList,
  createCode,
  createCategory,
  createLabel,
  parseSelectedCodeListId,
  getLocalizedText,
} from "./CodeRepresentation.utils";
import { useAppContext } from "../../../../application/app-context";
import { useDefaultLocale } from "../../../hooks/useDefaultLocale";
import { useAllCodesLists } from "../../../hooks/useAllCodesLists";
import { useMutualizedCodesList } from "../../../hooks/useMutualizedCodesList";

interface CodeRepresentationProps {
  representation?: CodeRepresentationType;
  codeList?: CodeList;
  categories?: Category[];
  currentVariableId?: string;
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
  currentVariableId,
  onChange,
}: Readonly<CodeRepresentationProps>) => {
  const { t } = useTranslation();
  const { properties } = useAppContext();
  const defaultAgencyId = properties.defaultAgencyId;
  const defaultLocale = useDefaultLocale();
  const { id: physicalInstanceId = "", agencyId = "" } = useParams<{
    id: string;
    agencyId: string;
  }>();
  const { data: allCodesLists = [] } = useAllCodesLists(agencyId, physicalInstanceId);
  const [state, dispatch] = useReducer(codeRepresentationReducer, {
    ...initialState,
    codeListLabel: getLocalizedText(codeList?.Label) ?? "",
  });

  const { codeListLabel, codes, showDataTable, showReuseSelect, selectedCodeListId } = state;

  const referencedCodeListAgency = codeList?.Agency ?? representation?.CodeListReference?.Agency;
  const referencedCodeListId = codeList?.ID ?? representation?.CodeListReference?.ID;
  const isReferencedListMutualized = Boolean(
    referencedCodeListAgency &&
    referencedCodeListId &&
    allCodesLists.find(
      (cl) => cl.agencyId === referencedCodeListAgency && cl.id === referencedCodeListId,
    )?.mutualized,
  );

  const [selectedAgency, selectedListId] = parseSelectedCodeListId(selectedCodeListId);
  const isSelectedListMutualized = Boolean(
    selectedAgency &&
    selectedListId &&
    allCodesLists.find((cl) => cl.agencyId === selectedAgency && cl.id === selectedListId)
      ?.mutualized,
  );

  // Liste de codes actuellement attachée à la variable (référencée ou en cours de sélection).
  // Le panneau des utilisations s'affiche dès qu'une liste est identifiable, y compris pour les
  // listes mutualisées.
  const codeListUsersAgency = referencedCodeListAgency ?? selectedAgency;
  const codeListUsersId = referencedCodeListId ?? selectedListId;
  const showUsersPanel = Boolean(codeListUsersAgency && codeListUsersId);
  // Contenu (codes + catégories) de la liste sélectionnée, récupéré par agency/id.
  // L'endpoint `mutualized-codes-list/{agency}/{id}` est générique côté back (il délègue à
  // getCodeList) : il sert donc aussi bien aux listes mutualisées qu'aux listes du groupe.
  // On charge le contenu dès qu'une liste est sélectionnée, quel que soit son type.
  const { data: selectedListCodes, isLoading: isLoadingSelectedListCodes } = useMutualizedCodesList(
    selectedAgency,
    selectedListId,
  );

  // Track the codeList ID to avoid reinitializing on every codeList change
  const codeListIdRef = useRef<string | undefined>(codeList?.ID);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Only reinitialize if the codeList ID actually changed (not just the content)
    const hasCodeListIdChanged = codeListIdRef.current !== codeList?.ID;
    const hasRepresentationChanged =
      representation?.CodeListReference?.ID !== undefined &&
      representation?.CodeListReference?.ID !== codeListIdRef.current;

    if (hasCodeListIdChanged || hasRepresentationChanged) {
      // Reset initialization flag when ID changes
      hasInitializedRef.current = false;
      codeListIdRef.current = codeList?.ID;
    }

    if (!hasCodeListIdChanged && !hasRepresentationChanged && hasInitializedRef.current) {
      // Already initialized this codeList, don't reinitialize
      return;
    }

    hasInitializedRef.current = true;

    if (codeList) {
      // Cas où on a une codeList complète (création ou liste existante chargée)
      const tableData: CodeTableRow[] = (codeList.Code || []).map((code) => {
        const category = categories.find((cat) => cat.ID === code.CategoryReference?.ID);
        return {
          id: code.ID,
          value: code.Value?.StringValue ?? "",
          label: getLocalizedText(category?.Label) ?? "",
          categoryId: category?.ID || "",
        };
      });
      dispatch({
        type: "INIT_FROM_CODE_LIST",
        payload: {
          label: getLocalizedText(codeList.Label) ?? "",
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
  }, [codeList?.ID, representation?.CodeListReference?.ID]);

  // Charge le contenu d'une liste réutilisée sélectionnée.
  // IMPORTANT : cet effet doit être déclaré APRÈS l'effet d'initialisation ci-dessus.
  // Lors d'une re-sélection d'une liste déjà en cache, les données reviennent en synchrone :
  // les deux effets se déclenchent dans le même commit et React les exécute dans l'ordre de
  // déclaration. L'initialisation (qui repart de l'état vide) doit donc s'exécuter d'abord,
  // puis ce chargement, sinon il écraserait les codes tout juste affichés.
  useEffect(() => {
    if (!selectedListCodes) return;
    const fetchedCodeList = selectedListCodes.CodeList?.[0];
    if (!fetchedCodeList) return;
    const categoryLabelById = new Map(
      (selectedListCodes.Category ?? []).map((cat) => [cat.ID, getLocalizedText(cat.Label) ?? ""]),
    );
    const rows: CodeTableRow[] = (fetchedCodeList.Code ?? []).map((code) => ({
      id: code.ID,
      value: code.Value?.StringValue ?? "",
      label: categoryLabelById.get(code.CategoryReference?.ID) ?? "",
      categoryId: code.CategoryReference?.ID ?? "",
    }));
    dispatch({
      type: "LOAD_REUSED_CODES",
      payload: {
        label: getLocalizedText(fetchedCodeList.Label) ?? "",
        codes: rows,
      },
    });
  }, [selectedListCodes]);

  const handleCodeListLabelChange = (newLabel: string) => {
    dispatch({ type: "SET_CODE_LIST_LABEL", payload: newLabel });

    const newCodeListId = codeList?.ID || crypto.randomUUID();
    const currentRepresentation =
      representation || createDefaultRepresentation(newCodeListId, defaultAgencyId);
    const updatedCodeList: CodeList = {
      ...(codeList ||
        createDefaultCodeList(newCodeListId, newLabel, defaultAgencyId, defaultLocale)),
      Label: createLabel(newLabel, defaultLocale),
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
      ...(codeList ||
        createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId, defaultLocale)),
      Label: createLabel(codeListLabel, defaultLocale),
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
    const newCategory = createCategory(
      updatedCode.categoryId,
      updatedCode.label,
      defaultAgencyId,
      defaultLocale,
    );
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
      ...(codeList ||
        createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId, defaultLocale)),
      Label: createLabel(codeListLabel, defaultLocale),
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
    const newCategory = createCategory(
      newRow.categoryId,
      newRow.label,
      defaultAgencyId,
      defaultLocale,
    );
    const newCode = createCode(newRow.id, newRow.categoryId, newRow.value, defaultAgencyId);

    const updatedCodeList: CodeList = {
      ...(codeList ||
        createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId, defaultLocale)),
      Label: createLabel(codeListLabel, defaultLocale),
      Code: [...(codeList?.Code || []), newCode],
    };

    onChange(currentRepresentation, updatedCodeList, [...categories, newCategory]);
  };

  const handleCreateNewList = () => {
    // Réinitialise complètement la liste de codes de la variable en cours d'édition :
    // on repart d'une liste neuve (nouvel ID) avec une seule ligne vide, en oubliant
    // toute liste réutilisée ou en cours de création.
    const newCodeListId = crypto.randomUUID();
    const newRow: CodeTableRow = {
      id: crypto.randomUUID(),
      value: "",
      label: "",
      categoryId: crypto.randomUUID(),
      isNew: true,
    };

    dispatch({ type: "RESET_NEW_CODE_LIST", payload: { codes: [newRow] } });

    const newRepresentation = createDefaultRepresentation(newCodeListId, defaultAgencyId);
    const newCode = createCode(newRow.id, newRow.categoryId, newRow.value, defaultAgencyId);
    const newCategory = createCategory(
      newRow.categoryId,
      newRow.label,
      defaultAgencyId,
      defaultLocale,
    );
    const newCodeList: CodeList = {
      ...createDefaultCodeList(newCodeListId, "", defaultAgencyId, defaultLocale),
      Code: [newCode],
    };

    onChange(newRepresentation, newCodeList, [newCategory]);
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
      ...(codeList ||
        createDefaultCodeList(newCodeListId, codeListLabel, defaultAgencyId, defaultLocale)),
      Label: createLabel(codeListLabel, defaultLocale),
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
          onClick={handleCreateNewList}
        />
        <Button
          type="button"
          icon="pi pi-sync"
          label={t("physicalInstance.view.code.reuseList")}
          outlined
          onClick={() => {
            dispatch({ type: "SHOW_REUSE_SELECT" });
          }}
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
      {isLoadingSelectedListCodes && (
        <div className="flex gap-2 align-items-center">
          <ProgressSpinner style={{ width: "20px", height: "20px", margin: "0" }} strokeWidth="4" />
          <span>{t("physicalInstance.view.code.loadingCodes")}</span>
        </div>
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
          readOnly={isReferencedListMutualized || isSelectedListMutualized}
        />
      )}
      {showUsersPanel && (
        <CodeListUsersPanel
          agencyId={codeListUsersAgency!}
          id={codeListUsersId!}
          currentVariableId={currentVariableId}
        />
      )}
    </div>
  );
};
