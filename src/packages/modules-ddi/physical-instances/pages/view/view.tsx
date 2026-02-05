import { useReducer, useRef, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import "./view.css";
import {
  PhysicalInstanceDialog,
  PhysicalInstanceUpdateData,
} from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";
import { SearchFilters } from "../../components/SearchFilters/SearchFilters";
import { GlobalActionsCard } from "../../components/GlobalActionsCard/GlobalActionsCard";
import { VariableEditForm } from "../../components/VariableEditForm/VariableEditForm";
import { usePhysicalInstancesData } from "../../../hooks/usePhysicalInstance";
import { useUpdatePhysicalInstance } from "../../../hooks/useUpdatePhysicalInstance";
import { usePublishPhysicalInstance } from "../../../hooks/usePublishPhysicalInstance";
import { viewReducer, initialState, actions, type VariableData } from "./viewReducer";
import { buildDuplicatedPhysicalInstance } from "./duplicatePhysicalInstance";
import { FILTER_ALL_TYPES, TOAST_DURATION, VARIABLE_TYPES } from "../../constants";
import type { VariableTableData, Variable, CodeList, Code, Category } from "../../types/api";
import { Loading } from "../../../../components/loading";
import { DDIApi } from "../../../../sdk";
import { useNavigationBlocker } from "../../../../utils/hooks/useNavigationBlocker";

export const Component = () => {
  const { id, agencyId } = useParams<{ id: string; agencyId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const initialRestoreDone = useRef(false);
  const [state, dispatch] = useReducer(viewReducer, initialState);
  const { data, variables, title, dataRelationshipName, isLoading, isError, error } =
    usePhysicalInstancesData(agencyId!, id!);
  const [searchParams, setSearchParams] = useSearchParams();
  const updatePhysicalInstance = useUpdatePhysicalInstance();
  const savePhysicalInstance = usePublishPhysicalInstance();

  useEffect(() => {
    if (
      (title || dataRelationshipName) &&
      (title !== state.formData.label || dataRelationshipName !== state.formData.name)
    ) {
      dispatch(actions.setFormData({ label: title, name: dataRelationshipName }));
    }
  }, [title, dataRelationshipName]);

  const tabParam = Number(searchParams.get("tab"));
  const activeTabIndex = [0, 1, 2].includes(tabParam) ? tabParam : 0;

  const handleTabChange = useCallback(
    (index: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (index === 0) {
            next.delete("tab");
          } else {
            next.set("tab", String(index));
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Sync selected variable ID to URL search params
  useEffect(() => {
    const currentVariableId = searchParams.get("variableId");
    const selectedId = state.selectedVariable?.id ?? null;

    if (selectedId && selectedId !== "new" && selectedId !== currentVariableId) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("variableId", selectedId);
          return next;
        },
        { replace: true },
      );
    } else if (!selectedId && currentVariableId && initialRestoreDone.current) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("variableId");
          next.delete("tab");
          return next;
        },
        { replace: true },
      );
    }
  }, [state.selectedVariable, searchParams, setSearchParams]);

  const variableTypeOptions = useMemo(
    () => [
      {
        label: t("physicalInstance.view.variableTypes.text"),
        value: VARIABLE_TYPES.TEXT,
      },
      {
        label: t("physicalInstance.view.variableTypes.code"),
        value: VARIABLE_TYPES.CODE,
      },
      {
        label: t("physicalInstance.view.variableTypes.date"),
        value: VARIABLE_TYPES.DATE,
      },
      {
        label: t("physicalInstance.view.variableTypes.numeric"),
        value: VARIABLE_TYPES.NUMERIC,
      },
    ],
    [t],
  );

  const typeOptions = useMemo(() => {
    return [
      { label: t("physicalInstance.view.allTypes"), value: FILTER_ALL_TYPES },
      ...variableTypeOptions,
    ];
  }, [variableTypeOptions, t]);

  // Get IDs of unsaved (local) variables
  const unsavedVariableIds = useMemo(() => {
    return state.localVariables.map((v) => v.id);
  }, [state.localVariables]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return state.localVariables.length > 0 || state.deletedVariableIds.length > 0;
  }, [state.localVariables, state.deletedVariableIds]);

  // Block navigation when there are unsaved changes (internal + F5/close tab)
  const handleNavigationBlock = useCallback(
    (proceed: () => void, reset: () => void) => {
      confirmDialog({
        message: t("physicalInstance.view.unsavedChangesMessage"),
        header: t("physicalInstance.view.unsavedChangesTitle"),
        icon: "pi pi-exclamation-triangle",
        acceptLabel: t("physicalInstance.view.leaveWithoutSaving"),
        rejectLabel: t("physicalInstance.view.stayOnPage"),
        acceptClassName: "p-button-danger",
        accept: proceed,
        reject: reset,
      });
    },
    [t],
  );

  useNavigationBlocker({
    shouldBlock: hasUnsavedChanges,
    onBlock: handleNavigationBlock,
  });

  // Merge variables from API with local modifications
  const mergedVariables = useMemo(() => {
    const variableMap = new Map(variables.map((v) => [v.id, v]));

    // Remove deleted variables
    state.deletedVariableIds.forEach((deletedId) => {
      variableMap.delete(deletedId);
    });

    // Apply local modifications and add new local variables
    state.localVariables.forEach((localVar) => {
      if (variableMap.has(localVar.id)) {
        // Update existing variable with new lastModified
        variableMap.set(localVar.id, {
          ...variableMap.get(localVar.id),
          ...localVar,
          lastModified: new Date().toISOString(),
        });
      } else {
        // Add new local variable with lastModified
        variableMap.set(localVar.id, {
          ...localVar,
          lastModified: new Date().toISOString(),
        });
      }
    });

    return Array.from(variableMap.values());
  }, [variables, state.localVariables, state.deletedVariableIds]);

  const filteredVariables = useMemo(() => {
    let filtered = mergedVariables;

    // Filtre par recherche
    if (state.searchValue) {
      const searchLower = state.searchValue.toLowerCase();
      filtered = filtered.filter((variable: VariableTableData) => {
        const nameMatch = variable.name.toLowerCase().includes(searchLower);
        const labelMatch = variable.label.toLowerCase().includes(searchLower);
        return nameMatch || labelMatch;
      });
    }
    // Filtre par type
    if (state.typeFilter !== FILTER_ALL_TYPES) {
      filtered = filtered.filter(
        (variable: VariableTableData) =>
          variable.type.toLowerCase() === state.typeFilter.toLowerCase(),
      );
    }

    return filtered;
  }, [mergedVariables, state.searchValue, state.typeFilter]);

  const handleExport = useCallback(
    async (format: "DDI3" | "DDI4") => {
      try {
        let exportedData: string;
        let fileName: string;

        if (format === "DDI3") {
          // Appel de l'API pour convertir en DDI3
          const result = await DDIApi.convertToDDI3(data);
          exportedData = result;
          // Nettoyer le titre pour créer un nom de fichier valide
          const sanitizedTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
          fileName = `${sanitizedTitle}-ddi3.xml`;
        } else {
          // Pour DDI4, on utilise les données telles quelles
          exportedData = JSON.stringify(data, null, 2);
          const sanitizedTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
          fileName = `${sanitizedTitle}-ddi4.json`;
        }

        // Créer un blob et déclencher le téléchargement
        const blob = new Blob([exportedData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Affichage du toast de succès
        toast.current?.show({
          severity: "success",
          summary: t("physicalInstance.view.exportSuccess"),
          detail: t("physicalInstance.view.exportSuccessDetail", { format }),
          life: TOAST_DURATION,
        });
      } catch (err) {
        // Affichage du toast d'erreur
        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.exportError"),
          detail: err instanceof Error ? err.message : t("physicalInstance.view.exportErrorDetail"),
          life: TOAST_DURATION,
        });
      }
    },
    [data, title, t],
  );

  const handleSearchChange = useCallback((value: string) => {
    dispatch(actions.setSearchValue(value));
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    dispatch(actions.setTypeFilter(value));
  }, []);

  const handleOpenEditModal = useCallback(() => {
    dispatch(actions.setEditModalVisible(true));
  }, []);

  const handleCloseEditModal = useCallback(() => {
    dispatch(actions.setEditModalVisible(false));
  }, []);

  const handleSaveEdit = useCallback(
    async (data: PhysicalInstanceUpdateData) => {
      const previousLabel = state.formData.label;
      const previousName = state.formData.name;

      dispatch(actions.setFormData({ label: data.label, name: data.name }));

      try {
        await updatePhysicalInstance.mutateAsync({
          id: id!,
          agencyId: agencyId!,
          data: {
            physicalInstanceLabel: data.label,
            dataRelationshipName: data.name,
            groupId: data.group.id,
            groupAgency: data.group.agency,
            studyUnitId: data.studyUnit.id,
            studyUnitAgency: data.studyUnit.agency,
          },
        });

        dispatch(actions.setEditModalVisible(false));

        toast.current?.show({
          severity: "success",
          summary: t("physicalInstance.view.saveSuccess"),
          detail: t("physicalInstance.view.saveSuccessDetail"),
          life: TOAST_DURATION,
        });
      } catch (err: unknown) {
        dispatch(actions.setFormData({ label: previousLabel, name: previousName }));

        const errorMessage =
          err && typeof err === "object" && "message" in err
            ? String(err.message)
            : t("physicalInstance.view.saveErrorDetail");

        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.saveError"),
          detail: errorMessage,
          life: TOAST_DURATION,
        });
      }
    },
    [id, agencyId, t, updatePhysicalInstance, state.formData.label, state.formData.name],
  );

  const handleVariableClick = useCallback(
    (variable: VariableTableData) => {
      // Vérifier d'abord si la variable a des modifications locales
      const localVariable = state.localVariables.find((v) => v.id === variable.id);

      if (localVariable) {
        // Utiliser les données locales si elles existent
        dispatch(actions.setSelectedVariable(localVariable));
      } else {
        // Sinon, trouver la variable complète dans les données brutes
        const fullVariable = data?.Variable?.find((v: Variable) => v.ID === variable.id);

        // Charger les informations complètes de la variable si trouvée
        const description = fullVariable?.Description?.Content?.["#text"] || undefined;
        const isGeographic = fullVariable?.["@isGeographic"] === "true";
        const textRepresentation = fullVariable?.VariableRepresentation?.TextRepresentation;
        const numericRepresentation = fullVariable?.VariableRepresentation?.NumericRepresentation;
        const dateRepresentation = fullVariable?.VariableRepresentation?.DateTimeRepresentation;
        const codeRepresentation = fullVariable?.VariableRepresentation?.CodeRepresentation;

        // Charger la CodeList et les Categories associées si disponibles
        let codeList = undefined;
        let categories = undefined;

        if (codeRepresentation) {
          const codeListId = codeRepresentation.CodeListReference.ID;
          codeList = data?.CodeList?.find((cl: CodeList) => cl.ID === codeListId);

          if (codeList && codeList.Code) {
            // Récupérer toutes les catégories liées aux codes
            const categoryIds = codeList.Code.map((code: Code) => code.CategoryReference.ID);
            categories = data?.Category?.filter((cat: Category) => categoryIds.includes(cat.ID));
          }
        }

        dispatch(
          actions.setSelectedVariable({
            id: variable.id,
            label: variable.label,
            name: variable.name,
            description,
            type: variable.type,
            isGeographic,
            textRepresentation,
            numericRepresentation,
            dateRepresentation,
            codeRepresentation,
            codeList,
            categories,
          }),
        );
      }
    },
    [data, state.localVariables],
  );

  // Restore selected variable from URL on initial load
  useEffect(() => {
    if (variables.length === 0) return;

    if (!initialRestoreDone.current) {
      initialRestoreDone.current = true;
      const variableId = searchParams.get("variableId");
      if (variableId) {
        const variable = variables.find((v: VariableTableData) => v.id === variableId);
        if (variable) {
          handleVariableClick(variable);
        }
      }
    }
  }, [variables, handleVariableClick, searchParams]);

  const handleNewVariable = useCallback(() => {
    dispatch(
      actions.setSelectedVariable({
        id: "new",
        label: "",
        name: "",
        type: VARIABLE_TYPES.TEXT,
      }),
    );
  }, []);

  // Navigation entre les variables (circulaire)
  const currentVariableIndex = useMemo(() => {
    if (!state.selectedVariable || state.selectedVariable.id === "new") return -1;
    return filteredVariables.findIndex((v) => v.id === state.selectedVariable?.id);
  }, [filteredVariables, state.selectedVariable]);

  const hasVariablesToNavigate = filteredVariables.length > 1 && currentVariableIndex >= 0;

  const handlePreviousVariable = useCallback(() => {
    if (currentVariableIndex >= 0 && filteredVariables.length > 0) {
      const previousIndex =
        currentVariableIndex === 0 ? filteredVariables.length - 1 : currentVariableIndex - 1;
      handleVariableClick(filteredVariables[previousIndex]);
    }
  }, [currentVariableIndex, filteredVariables, handleVariableClick]);

  const handleNextVariable = useCallback(() => {
    if (currentVariableIndex >= 0 && filteredVariables.length > 0) {
      const nextIndex =
        currentVariableIndex === filteredVariables.length - 1 ? 0 : currentVariableIndex + 1;
      handleVariableClick(filteredVariables[nextIndex]);
    }
  }, [currentVariableIndex, filteredVariables, handleVariableClick]);

  const handleVariableSave = useCallback(
    (data: VariableData) => {
      const isNew = data.id === "new";

      // Si l'ID est 'new', c'est une nouvelle variable
      if (isNew) {
        const newId = crypto.randomUUID();
        dispatch(
          actions.addVariable({
            ...data,
            id: newId,
          }),
        );
      } else {
        // Mise à jour d'une variable existante
        dispatch(actions.updateVariable(data));
      }

      // Fermer le formulaire
      dispatch(actions.setSelectedVariable(null));

      toast.current?.show({
        severity: "success",
        summary: isNew
          ? t("physicalInstance.view.variableAddSuccess")
          : t("physicalInstance.view.variableUpdateSuccess"),
        detail: isNew
          ? t("physicalInstance.view.variableAddSuccessDetail")
          : t("physicalInstance.view.variableUpdateSuccessDetail"),
        life: TOAST_DURATION,
      });
    },
    [t],
  );

  const handleVariableDuplicate = useCallback(
    (data: VariableData) => {
      // Ajouter la variable dupliquée
      dispatch(actions.addVariable(data));

      // Garder le formulaire ouvert avec la nouvelle variable
      dispatch(actions.setSelectedVariable(data));

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.variableDuplicateSuccess"),
        detail: t("physicalInstance.view.variableDuplicateSuccessDetail"),
        life: TOAST_DURATION,
      });
    },
    [t],
  );

  const handleDeleteVariable = useCallback(
    (variable: VariableTableData) => {
      confirmDialog({
        message: t("physicalInstance.view.deleteVariableConfirmMessage", {
          name: variable.name,
        }),
        header: t("physicalInstance.view.deleteVariableConfirmTitle"),
        icon: "pi pi-exclamation-triangle",
        acceptLabel: t("physicalInstance.view.confirmDelete"),
        rejectLabel: t("physicalInstance.view.cancelDelete"),
        acceptClassName: "p-button-danger",
        accept: () => {
          // Supprimer la variable des variables locales
          dispatch(actions.deleteVariable(variable.id));

          // Fermer le formulaire d'édition si la variable supprimée est sélectionnée
          if (state.selectedVariable?.id === variable.id) {
            dispatch(actions.setSelectedVariable(null));
          }

          toast.current?.show({
            severity: "success",
            summary: t("physicalInstance.view.deleteVariableSuccess"),
            detail: t("physicalInstance.view.deleteVariableSuccessDetail"),
            life: TOAST_DURATION,
          });
        },
      });
    },
    [t, state.selectedVariable],
  );

  const handleSaveAll = useCallback(async () => {
    try {
      // Fusionner les données avec les variables locales
      // S'assurer que CodeList et Category ne sont jamais null mais toujours des tableaux
      const mergedData = {
        ...data,
        CodeList: data?.CodeList || [],
        Category: data?.Category || [],
      };

      // Si on a des variables locales ou des suppressions, mettre à jour les variables
      if (state.localVariables.length > 0 || state.deletedVariableIds.length > 0) {
        const existingVariables = data?.Variable || [];
        const variableMap = new Map(existingVariables.map((v: Variable) => [v.ID, v]));

        // Maps pour gérer les CodeLists et Categories
        const codeListMap = new Map((data?.CodeList || []).map((cl: any) => [cl.ID, cl]));
        const categoryMap = new Map((data?.Category || []).map((cat: any) => [cat.ID, cat]));

        // Supprimer les variables marquées comme supprimées
        state.deletedVariableIds.forEach((deletedId) => {
          variableMap.delete(deletedId);
        });

        // Transformer les variables locales au format DDI et les ajouter/mettre à jour
        state.localVariables.forEach((localVar) => {
          // Ne pas ajouter les variables qui ont été supprimées
          if (state.deletedVariableIds.includes(localVar.id)) {
            return;
          }

          // Construire la représentation selon le type
          let variableRepresentation: Variable["VariableRepresentation"];
          if (localVar.textRepresentation) {
            variableRepresentation = {
              TextRepresentation: localVar.textRepresentation,
            };
          } else if (localVar.numericRepresentation) {
            variableRepresentation = {
              NumericRepresentation: localVar.numericRepresentation,
            };
          } else if (localVar.dateRepresentation) {
            variableRepresentation = {
              DateTimeRepresentation: localVar.dateRepresentation,
            };
          } else if (localVar.codeRepresentation) {
            // Ajouter la CodeList et les Categories si elles existent
            if (localVar.codeList) {
              // Filtrer les codes vides (sans valeur ET sans label)
              const filteredCodeList = {
                ...localVar.codeList,
                Code: (localVar.codeList.Code || []).filter((code: Code) => {
                  const category = localVar.categories?.find(
                    (cat) => cat.ID === code.CategoryReference?.ID,
                  );
                  const label = category?.Label?.Content?.["#text"] || "";
                  const value = code.Value || "";
                  return value.trim() !== "" || label.trim() !== "";
                }),
              };
              codeListMap.set(filteredCodeList.ID, filteredCodeList);
            }
            if (localVar.categories) {
              // Ne garder que les catégories liées aux codes valides
              const validCategoryIds = new Set(
                (localVar.codeList?.Code || [])
                  .filter((code: Code) => {
                    const category = localVar.categories?.find(
                      (cat) => cat.ID === code.CategoryReference?.ID,
                    );
                    const label = category?.Label?.Content?.["#text"] || "";
                    const value = code.Value || "";
                    return value.trim() !== "" || label.trim() !== "";
                  })
                  .map((code: Code) => code.CategoryReference?.ID),
              );
              localVar.categories
                .filter((cat) => validCategoryIds.has(cat.ID))
                .forEach((cat) => {
                  categoryMap.set(cat.ID, cat);
                });
            }

            // S'assurer que la CodeListReference pointe vers le bon ID
            const codeRepresentation = {
              ...localVar.codeRepresentation,
              CodeListReference: {
                ...localVar.codeRepresentation.CodeListReference,
                ID: localVar.codeList?.ID || localVar.codeRepresentation.CodeListReference.ID,
              },
            };

            variableRepresentation = {
              CodeRepresentation: codeRepresentation,
            };
          }

          const ddiVariable: Variable = {
            "@isUniversallyUnique": "true",
            "@versionDate": new Date().toISOString(),
            URN: `urn:ddi:${agencyId}:${localVar.id}:1`,
            Agency: agencyId!,
            ID: localVar.id,
            Version: "1",
            VariableName: {
              String: {
                "@xml:lang": "fr-FR",
                "#text": localVar.name,
              },
            },
            Label: {
              Content: {
                "@xml:lang": "fr-FR",
                "#text": localVar.label,
              },
            },
            ...(localVar.description && {
              Description: {
                Content: {
                  "@xml:lang": "fr-FR",
                  "#text": localVar.description,
                },
              },
            }),
            ...(localVar.isGeographic && {
              "@isGeographic": "true",
            }),
            ...(variableRepresentation && {
              VariableRepresentation: variableRepresentation,
            }),
          };

          variableMap.set(localVar.id, ddiVariable);
        });

        mergedData.Variable = Array.from(variableMap.values());

        // Mettre à jour CodeList et Category avec les valeurs fusionnées
        mergedData.CodeList = Array.from(codeListMap.values());
        mergedData.Category = Array.from(categoryMap.values());
      }

      // Mettre à jour les références de variables dans LogicalRecord
      if (mergedData.DataRelationship?.[0]?.LogicalRecord && mergedData.Variable) {
        const allVariableIds = mergedData.Variable.map((v: Variable) => v.ID);

        const variableReferences = allVariableIds.map((varId: string) => ({
          Agency: agencyId!,
          ID: varId,
          Version: "1",
          TypeOfObject: "Variable",
        }));

        mergedData.DataRelationship[0].LogicalRecord.VariablesInRecord = {
          VariableUsedReference: variableReferences,
        };
      }

      await savePhysicalInstance.mutateAsync({
        id: id!,
        agencyId: agencyId!,
        data: mergedData,
      });

      // Nettoyer les variables locales après une sauvegarde réussie
      dispatch(actions.clearLocalVariables());

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.saveAllSuccess"),
        detail: t("physicalInstance.view.saveAllSuccessDetail"),
        life: TOAST_DURATION,
      });
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : t("physicalInstance.view.saveAllErrorDetail");

      toast.current?.show({
        severity: "error",
        summary: t("physicalInstance.view.saveAllError"),
        detail: errorMessage,
        life: TOAST_DURATION,
      });
    }
  }, [id, agencyId, data, state.localVariables, state.deletedVariableIds, savePhysicalInstance, t]);

  const handleDuplicatePhysicalInstance = useCallback(async () => {
    try {
      const { duplicatedData, newPhysicalInstanceId, newAgencyId } =
        buildDuplicatedPhysicalInstance({
          agencyId: agencyId!,
          data,
          title,
        });

      // Sauvegarder la nouvelle physical instance via l'API
      await savePhysicalInstance.mutateAsync({
        id: newPhysicalInstanceId,
        agencyId: newAgencyId,
        data: duplicatedData,
      });

      // Rediriger vers la page de la nouvelle physical instance
      navigate(`/ddi/physical-instances/${newAgencyId}/${newPhysicalInstanceId}`);

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.duplicateSuccess"),
        detail: t("physicalInstance.view.duplicateSuccessDetail"),
        life: TOAST_DURATION,
      });
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: t("physicalInstance.view.duplicateError"),
        detail:
          err instanceof Error ? err.message : t("physicalInstance.view.duplicateErrorDetail"),
        life: TOAST_DURATION,
      });
    }
  }, [agencyId, data, title, savePhysicalInstance, navigate, t]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div role="alert" aria-live="assertive">
        <Message
          severity="error"
          text={error instanceof Error ? error.message : t("physicalInstance.view.errorLoading")}
        />
      </div>
    );
  }

  return (
    <div className="flex" role="main">
      <div
        className={state.selectedVariable ? "col-8" : "col-12"}
        style={{
          width: state.selectedVariable ? "66.666%" : "100%",
          transition: "width 0.3s ease",
        }}
      >
        <div className="flex align-items-center gap-2 mb-3">
          <h1 className="m-0">{state.formData.label || title}</h1>
          <Button
            icon="pi pi-pencil"
            text
            rounded
            aria-label={t("physicalInstance.view.editTitle")}
            onClick={handleOpenEditModal}
          />
        </div>

        <SearchFilters
          searchValue={state.searchValue}
          onSearchChange={handleSearchChange}
          typeFilter={state.typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          typeOptions={typeOptions}
          onNewVariable={handleNewVariable}
          onSaveAll={handleSaveAll}
          hasLocalChanges={hasUnsavedChanges}
        />

        <GlobalActionsCard
          variables={filteredVariables}
          onExport={handleExport}
          onDuplicate={handleDuplicatePhysicalInstance}
          onRowClick={handleVariableClick}
          onDeleteClick={handleDeleteVariable}
          unsavedVariableIds={unsavedVariableIds}
          selectedVariableId={state.selectedVariable?.id}
        />
      </div>
      {state.selectedVariable && (
        <div className="col-4" role="complementary">
          <VariableEditForm
            variable={state.selectedVariable}
            typeOptions={variableTypeOptions}
            isNew={state.selectedVariable.id === "new"}
            onSave={handleVariableSave}
            onDuplicate={handleVariableDuplicate}
            onPrevious={handlePreviousVariable}
            onNext={handleNextVariable}
            hasPrevious={hasVariablesToNavigate}
            hasNext={hasVariablesToNavigate}
            activeTabIndex={activeTabIndex}
            onTabChange={handleTabChange}
          />
        </div>
      )}

      <PhysicalInstanceDialog
        visible={state.isEditModalVisible}
        onHide={handleCloseEditModal}
        mode="edit"
        initialData={{ label: state.formData.label }}
        onSubmitEdit={handleSaveEdit}
      />

      <ConfirmDialog />
      <Toast ref={toast} />
    </div>
  );
};
