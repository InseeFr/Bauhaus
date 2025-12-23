import { useReducer, useRef, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import "./view.css";
import { EditModal } from "../../components/EditModal/EditModal";
import { SearchFilters } from "../../components/SearchFilters/SearchFilters";
import { GlobalActionsCard } from "../../components/GlobalActionsCard/GlobalActionsCard";
import { VariableEditForm } from "../../components/VariableEditForm/VariableEditForm";
import { usePhysicalInstancesData } from "../../../hooks/usePhysicalInstance";
import { useUpdatePhysicalInstance } from "../../../hooks/useUpdatePhysicalInstance";
import { usePublishPhysicalInstance } from "../../../hooks/usePublishPhysicalInstance";
import { viewReducer, initialState, actions, type VariableData } from "./viewReducer";
import { FILTER_ALL_TYPES, TOAST_DURATION, VARIABLE_TYPES } from "../../constants";
import type { VariableTableData, Variable, CodeList, Code, Category } from "../../types/api";
import { Loading } from "../../../../components/loading";
import { DDIApi } from "../../../../sdk";

export const Component = () => {
  const { id, agencyId } = useParams<{ id: string; agencyId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [state, dispatch] = useReducer(viewReducer, initialState);
  const { data, variables, title, dataRelationshipName, isLoading, isError, error } =
    usePhysicalInstancesData(agencyId!, id!);
  const updatePhysicalInstance = useUpdatePhysicalInstance();
  const savePhysicalInstance = usePublishPhysicalInstance();

  useEffect(() => {
    if (title || dataRelationshipName) {
      dispatch(actions.setFormData({ label: title, name: dataRelationshipName }));
    }
  }, [title, dataRelationshipName]);

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

  const handleFormDataChange = useCallback((data: { label: string; name: string }) => {
    dispatch(actions.setFormData(data));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await updatePhysicalInstance.mutateAsync({
        id: id!,
        agencyId: agencyId!,
        data: {
          physicalInstanceLabel: state.formData.label,
          dataRelationshipName: "DataRelationShip Name:" + state.formData.label,
        },
      });

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.saveSuccess"),
        detail: t("physicalInstance.view.saveSuccessDetail"),
        life: TOAST_DURATION,
      });

      dispatch(actions.setEditModalVisible(false));
    } catch (err: unknown) {
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
  }, [state.formData, id, agencyId, t, updatePhysicalInstance]);

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
              codeListMap.set(localVar.codeList.ID, localVar.codeList);
            }
            if (localVar.categories) {
              localVar.categories.forEach((cat) => {
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
      // Générer de nouveaux IDs pour tous les objets sauf CodeList et Category
      const newAgencyId = agencyId!;
      const newPhysicalInstanceId = crypto.randomUUID();
      const newDataRelationshipId = crypto.randomUUID();
      const newLogicalRecordId = crypto.randomUUID();

      // Créer un mapping des anciens IDs de variables vers les nouveaux
      const variableIdMap = new Map<string, string>();
      if (data?.Variable) {
        data.Variable.forEach((v: Variable) => {
          variableIdMap.set(v.ID, crypto.randomUUID());
        });
      }

      // Dupliquer les données en régénérant les IDs
      const duplicatedData = {
        ...data,
        // Garder les mêmes CodeList et Category (pas de régénération d'ID)
        CodeList: data?.CodeList || [],
        Category: data?.Category || [],
        // Dupliquer les variables avec de nouveaux IDs et BasedOnObject
        Variable: data?.Variable?.map((variable: Variable) => {
          const newVariableId = variableIdMap.get(variable.ID)!;
          return {
            ...variable,
            ID: newVariableId,
            URN: `urn:ddi:${newAgencyId}:${newVariableId}:1`,
            Agency: newAgencyId,
            "@versionDate": new Date().toISOString(),
            BasedOnObject: {
              BasedOnReference: {
                Agency: variable.Agency,
                ID: variable.ID,
                Version: variable.Version || "1",
                TypeOfObject: "Variable",
              },
            },
          };
        }),
        // Mettre à jour DataRelationship avec nouveaux IDs, nom et BasedOnObject
        DataRelationship: data?.DataRelationship?.map((dr: any) => ({
          ...dr,
          ID: newDataRelationshipId,
          URN: `urn:ddi:${newAgencyId}:${newDataRelationshipId}:1`,
          Agency: newAgencyId,
          "@versionDate": new Date().toISOString(),
          BasedOnObject: {
            BasedOnReference: {
              Agency: dr.Agency,
              ID: dr.ID,
              Version: dr.Version || "1",
              TypeOfObject: "DataRelationship",
            },
          },
          DataRelationshipName: {
            ...dr.DataRelationshipName,
            String: {
              ...dr.DataRelationshipName?.String,
              "#text": `${dr.DataRelationshipName?.String?.["#text"] || ""} (copy)`,
            },
          },
          LogicalRecord: {
            ...dr.LogicalRecord,
            ID: newLogicalRecordId,
            URN: `urn:ddi:${newAgencyId}:${newLogicalRecordId}:1`,
            Agency: newAgencyId,
            "@versionDate": new Date().toISOString(),
            VariablesInRecord: {
              VariableUsedReference: Array.from(variableIdMap.values()).map((newVarId) => ({
                Agency: newAgencyId,
                ID: newVarId,
                Version: "1",
                TypeOfObject: "Variable",
              })),
            },
          },
        })),
        // Mettre à jour PhysicalInstance avec nouveaux IDs, label et BasedOnObject
        PhysicalInstance: data?.PhysicalInstance?.map((pi: any) => ({
          ...pi,
          ID: newPhysicalInstanceId,
          URN: `urn:ddi:${newAgencyId}:${newPhysicalInstanceId}:1`,
          Agency: newAgencyId,
          "@versionDate": new Date().toISOString(),
          BasedOnObject: {
            BasedOnReference: {
              Agency: pi.Agency,
              ID: pi.ID,
              Version: pi.Version || "1",
              TypeOfObject: "PhysicalInstance",
            },
          },
          Citation: {
            ...pi.Citation,
            Title: {
              ...pi.Citation?.Title,
              String: {
                ...pi.Citation?.Title?.String,
                "#text": `${title} (copy)`,
              },
            },
          },
          PhysicalInstanceLabel: {
            ...pi.PhysicalInstanceLabel,
            Content: {
              ...pi.PhysicalInstanceLabel?.Content,
              "#text": `${title} (copy)`,
            },
          },
          DataRelationshipReference: {
            Agency: newAgencyId,
            ID: newDataRelationshipId,
            Version: "1",
            TypeOfObject: "DataRelationship",
          },
        })),
      };

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
          <h1 className="m-0">{title}</h1>
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
          hasLocalChanges={state.localVariables.length > 0 || state.deletedVariableIds.length > 0}
        />

        <GlobalActionsCard
          variables={filteredVariables}
          onExport={handleExport}
          onDuplicate={handleDuplicatePhysicalInstance}
          onRowClick={handleVariableClick}
          onDeleteClick={handleDeleteVariable}
          unsavedVariableIds={unsavedVariableIds}
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
          />
        </div>
      )}

      <EditModal
        visible={state.isEditModalVisible}
        onHide={handleCloseEditModal}
        formData={state.formData}
        onFormDataChange={handleFormDataChange}
        onSave={handleSave}
      />

      <ConfirmDialog />
      <Toast ref={toast} />
    </div>
  );
};
