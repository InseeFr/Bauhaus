import {
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import "./view.css";
import type {
  PhysicalInstanceUpdateData,
  PhysicalInstanceCreationData,
} from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";

const PhysicalInstanceDialog = lazy(() =>
  import("../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog").then(
    (module) => ({ default: module.PhysicalInstanceDialog }),
  ),
);
import { usePhysicalInstanceParents } from "../../../hooks/usePhysicalInstanceParents";
import { SearchFilters } from "../../components/SearchFilters/SearchFilters";
import { GlobalActionsCard } from "../../components/GlobalActionsCard/GlobalActionsCard";
import { VariableEditForm } from "../../components/VariableEditForm/VariableEditForm";
import { DdiDevTools } from "../../components/DdiDevTools/DdiDevTools";
import { usePhysicalInstancesData } from "../../../hooks/usePhysicalInstance";
import { useUpdatePhysicalInstance } from "../../../hooks/useUpdatePhysicalInstance";
import { usePublishPhysicalInstance } from "../../../hooks/usePublishPhysicalInstance";
import { viewReducer, initialState, actions, type VariableData } from "./viewReducer";
import { buildDuplicatedPhysicalInstance } from "./duplicatePhysicalInstance";
import { FILTER_ALL_TYPES, TOAST_DURATION, VARIABLE_TYPES } from "../../constants";
import type {
  VariableTableData,
  Variable,
  CodeList,
  Code,
  Category,
  LogicalRecord,
} from "../../types/api";
import { itemsOfType, replaceItemsOfType } from "../../types/ddi4Items";
import { LoadingOverlay } from "../../../../components/loading-overlay";
import { useNavigationBlocker } from "../../../../utils/hooks/useNavigationBlocker";
import { PhysicalInstanceHeader } from "./PhysicalInstanceHeader";
import { useDefaultLocale } from "../../../hooks/useDefaultLocale";
import { useExport } from "../../../hooks/useExport";
import { useValidateDdi4 } from "../../../hooks/useValidateDdi4";
import { usePhysicalInstanceByLangs } from "../../../hooks/usePhysicalInstanceByLangs";
import { pickLang, singletonEntries } from "../../../utils/multilingual";
import { loadCodeListForVariable } from "./loadCodeListForVariable";
import { findLocalCodeListOverride } from "./findLocalCodeListOverride";
import { findLocalCategoryOverrides } from "./findLocalCategoryOverrides";
import { cx } from "@utils/cx";
import { getApiErrorMessage } from "@utils/api-errors";

export const Component = () => {
  const { id, agencyId } = useParams<{ id: string; agencyId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const initialRestoreDone = useRef(false);
  const [state, dispatch] = useReducer(viewReducer, initialState);
  const queryClient = useQueryClient();
  const { data, variables, title, isLoading, isError, error } = usePhysicalInstancesData(
    agencyId!,
    id!,
  );

  const { data: parents } = usePhysicalInstanceParents(agencyId!, id!);

  const currentGroup = parents?.group;
  const currentStudyUnit = parents?.studyUnit;
  const currentStamps = parents?.stamps;
  const [duplicateDialogVisible, setDuplicateDialogVisible] = useState(false);
  // Modifications en cours dans le panneau d'édition, non validées par « Mettre à jour ».
  const [isEditedVariableDirty, setEditedVariableDirty] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const updatePhysicalInstance = useUpdatePhysicalInstance();
  const savePhysicalInstance = usePublishPhysicalInstance();
  const defaultLocale = useDefaultLocale();
  const dataByLangs = usePhysicalInstanceByLangs(data);

  useEffect(() => {
    if (title && title !== state.formData.label) {
      dispatch(actions.setFormData({ label: title }));
    }
  }, [title]);

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

  // Fermer le panneau latéral d'édition avec la touche Échap
  useEffect(() => {
    if (!state.selectedVariable) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(actions.setSelectedVariable(null));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedVariable]);

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

  // Valeurs sentinelles (#1566) : MMVR référencées par les AUTRES variables locales non
  // sauvegardées — le back ne les connaît pas encore, ce décompte complète le sien pour la règle
  // lecture seule/écriture de la section sentinelles.
  const locallyUsedMmvrIds = useMemo(() => {
    const currentId = state.selectedVariable?.id;
    return Array.from(
      new Set(
        state.localVariables
          .filter((localVar) => localVar.id !== currentId)
          .map((localVar) => localVar.missingValuesReference?.ID)
          .filter((mmvrId): mmvrId is string => Boolean(mmvrId)),
      ),
    );
  }, [state.localVariables, state.selectedVariable?.id]);

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

    // Apply local modifications to existing variables, keeping them in place
    const newLocalVariables: VariableData[] = [];
    state.localVariables.forEach((localVar) => {
      if (variableMap.has(localVar.id)) {
        // Update existing variable with new lastModified
        variableMap.set(localVar.id, {
          ...variableMap.get(localVar.id),
          ...localVar,
          lastModified: new Date().toISOString(),
        });
      } else {
        newLocalVariables.push(localVar);
      }
    });

    // Add new local variables: right after the variable they originate from when there is one
    // (duplication), at the end of the table otherwise (creation).
    const merged = Array.from(variableMap.values());
    newLocalVariables.forEach((localVar) => {
      const newVariable = {
        ...localVar,
        lastModified: new Date().toISOString(),
      };
      const anchorId = state.newVariableAnchors[localVar.id];
      const anchorIndex = anchorId ? merged.findIndex((v) => v.id === anchorId) : -1;
      if (anchorIndex === -1) {
        merged.push(newVariable);
      } else {
        merged.splice(anchorIndex + 1, 0, newVariable);
      }
    });

    return merged;
  }, [variables, state.localVariables, state.deletedVariableIds, state.newVariableAnchors]);

  const filteredVariables = useMemo(() => {
    const searchLower = state.searchValue ? state.searchValue.toLowerCase() : null;
    const typeLower = state.typeFilter === FILTER_ALL_TYPES ? null : state.typeFilter.toLowerCase();

    // Aucun filtre actif : on renvoie la référence telle quelle (pas de copie)
    if (searchLower === null && typeLower === null) {
      return mergedVariables;
    }

    // Une seule passe combinant recherche et type
    return mergedVariables.filter((variable: VariableTableData) => {
      if (
        searchLower !== null &&
        !variable.name.toLowerCase().includes(searchLower) &&
        !variable.label.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
      if (typeLower !== null && variable.type.toLowerCase() !== typeLower) {
        return false;
      }
      return true;
    });
  }, [mergedVariables, state.searchValue, state.typeFilter]);

  const handleExport = useExport(data, title, toast);
  const { validate: handleValidateDdi4, isValidating } = useValidateDdi4(data, toast);

  const handleSearchChange = useCallback((value: string) => {
    dispatch(actions.setSearchValue(value));
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    dispatch(actions.setTypeFilter(value));
  }, []);

  const handleSaveEdit = useCallback(
    async (data: PhysicalInstanceUpdateData) => {
      const previousLabel = state.formData.label;

      dispatch(actions.setFormData({ label: data.label }));

      try {
        await updatePhysicalInstance.mutateAsync({
          id: id!,
          agencyId: agencyId!,
          data: {
            physicalInstanceLabel: data.label,
            dataRelationshipLabel: data.dataRelationshipLabel,
            logicalRecordLabel: data.logicalRecordLabel,
            groupId: data.group.id,
            groupAgency: data.group.agency,
            studyUnitId: data.studyUnit.id,
            studyUnitAgency: data.studyUnit.agency,
          },
        });

        toast.current?.show({
          severity: "success",
          summary: t("physicalInstance.view.saveSuccess"),
          detail: t("physicalInstance.view.saveSuccessDetail"),
          life: TOAST_DURATION,
        });
      } catch (err: unknown) {
        dispatch(actions.setFormData({ label: previousLabel }));

        const errorMessage = getApiErrorMessage(err, t("physicalInstance.view.saveErrorDetail"));

        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.saveError"),
          detail: errorMessage,
          life: TOAST_DURATION,
        });

        throw err;
      }
    },
    [id, agencyId, t, updatePhysicalInstance, state.formData.label],
  );

  const handleVariableClick = useCallback(
    async (variable: VariableTableData) => {
      // Vérifier d'abord si la variable a des modifications locales
      const localVariable = state.localVariables.find((v) => v.id === variable.id);

      if (localVariable) {
        // Utiliser les données locales si elles existent
        dispatch(actions.setSelectedVariable(localVariable));
        return;
      }

      // Sinon, trouver la variable complète dans les données brutes
      const fullVariable = itemsOfType(data, "Variable").find(
        (v: Variable) => v.ID === variable.id,
      );

      // Charger les informations complètes de la variable si trouvée
      // VersionDate enregistrée : l'aperçu DDI doit refléter la donnée stockée, pas un
      // horodatage recalculé à chaque ouverture (qui divergeait du XML exporté).
      const storedVersionDate = fullVariable?.VersionDate?.DateTime;
      const description = pickLang(fullVariable?.Description, "fr-FR") || undefined;
      const isGeographic = fullVariable?.["@isGeographic"] === "true";
      const textRepresentation = fullVariable?.VariableRepresentation?.TextRepresentation;
      const numericRepresentation = fullVariable?.VariableRepresentation?.NumericRepresentation;
      const dateRepresentation = fullVariable?.VariableRepresentation?.DateTimeRepresentation;
      const codeRepresentation = fullVariable?.VariableRepresentation?.CodeRepresentation;
      // Valeurs sentinelles (#1566) : une variable relue porte au plus la référence — la MMVR
      // elle-même vit dans le groupe (réutilisation, lecture seule côté formulaire).
      const missingValuesReference = fullVariable?.VariableRepresentation?.MissingValuesReference;

      // Les CodeList et Category ne sont plus dans la GET PI : on les charge à la
      // demande quand l'utilisateur ouvre une variable Code (cache via react-query).
      let codeList: CodeList | undefined;
      let categories: Category[] | undefined;
      if (codeRepresentation) {
        // Si une autre variable a déjà surchargé cette liste localement (non encore enregistrée),
        // on affiche la version surchargée plutôt que celle (périmée) rechargée du back-office.
        const localOverride = findLocalCodeListOverride(
          state.localVariables,
          codeRepresentation.CodeListReference?.ID,
        );
        if (localOverride) {
          dispatch(
            actions.setSelectedVariable({
              id: variable.id,
              label: variable.label,
              name: variable.name,
              versionDate: storedVersionDate,
              description,
              type: variable.type,
              isGeographic,
              textRepresentation,
              numericRepresentation,
              dateRepresentation,
              codeRepresentation,
              codeList: localOverride.codeList,
              categories: localOverride.categories,
              missingValuesReference,
            }),
          );
          return;
        }

        const loaded = await loadCodeListForVariable(queryClient, codeRepresentation);
        codeList = loaded.codeList;
        // Une catégorie peut être partagée par des listes DIFFÉRENTES : si une autre variable
        // locale l'a déjà surchargée, on affiche sa version plutôt que celle (périmée) du back.
        // Sans cela, valider cette variable réinjecterait l'ancienne valeur au moment de la
        // sauvegarde et annulerait silencieusement la modification.
        categories = findLocalCategoryOverrides(state.localVariables, loaded.categories);

        // La variable référence une liste de codes qui n'existe pas : on le signale
        // explicitement (agency + id de la variable ET de la liste) au lieu d'afficher
        // une liste vide silencieuse.
        if (loaded.missing) {
          const ref = codeRepresentation.CodeListReference;
          toast.current?.show({
            severity: "error",
            summary: t("physicalInstance.view.code.missingCodeListTitle"),
            detail: t("physicalInstance.view.code.missingCodeListDetail", {
              variableAgency: fullVariable?.Agency ?? agencyId,
              variableId: variable.id,
              codeListAgency: ref?.Agency,
              codeListId: ref?.ID,
            }),
            sticky: true,
          });
        }
      }

      dispatch(
        actions.setSelectedVariable({
          id: variable.id,
          label: variable.label,
          name: variable.name,
          versionDate: storedVersionDate,
          description,
          type: variable.type,
          isGeographic,
          textRepresentation,
          numericRepresentation,
          dateRepresentation,
          codeRepresentation,
          codeList,
          categories,
          missingValuesReference,
        }),
      );
    },
    [data, state.localVariables, queryClient, t, agencyId],
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
      // Ajouter la variable dupliquée, ancrée juste après la variable dont elle est issue
      dispatch(actions.addVariable(data, state.selectedVariable?.id));

      // Garder le formulaire ouvert avec la nouvelle variable
      dispatch(actions.setSelectedVariable(data));

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.variableDuplicateSuccess"),
        detail: t("physicalInstance.view.variableDuplicateSuccessDetail"),
        life: TOAST_DURATION,
      });
    },
    [t, state.selectedVariable?.id],
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

  const saveAll = useCallback(async () => {
    try {
      // L'enveloppe DDI 4 ne porte qu'un tableau `items` à plat : on travaille ici sur des
      // listes par type, réassemblées en `items` juste avant l'envoi.
      let variables = itemsOfType(data, "Variable");
      const codeListMap = new Map(itemsOfType(data, "CodeList").map((cl) => [cl.ID, cl]));
      const categoryMap = new Map(itemsOfType(data, "Category").map((cat) => [cat.ID, cat]));
      // MMVR : valeurs sentinelles, #1566
      const mmvrMap = new Map(
        itemsOfType(data, "ManagedMissingValuesRepresentation").map((mmvr) => [mmvr.ID, mmvr]),
      );

      // Si on a des variables locales ou des suppressions, mettre à jour les variables
      if (state.localVariables.length > 0 || state.deletedVariableIds.length > 0) {
        const variableMap = new Map(variables.map((v: Variable) => [v.ID, v]));

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
                  const label = pickLang(category?.Label, "fr-FR") ?? "";
                  const value = code.Value?.StringValue ?? "";
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
                    const label = pickLang(category?.Label, "fr-FR") ?? "";
                    const value = code.Value?.StringValue ?? "";
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

            // S'assurer que la CodeListReference pointe vers le bon ID. Elle est optionnelle au
            // schéma mais toujours posée par `createDefaultRepresentation` : une représentation
            // code n'a pas de sens sans elle.
            const codeListReference = localVar.codeRepresentation.CodeListReference!;
            const codeRepresentation = {
              ...localVar.codeRepresentation,
              CodeListReference: {
                ...codeListReference,
                ID: localVar.codeList?.ID || codeListReference.ID,
              },
            };

            variableRepresentation = {
              CodeRepresentation: codeRepresentation,
            };
          }

          // Valeurs sentinelles (#1566) : la référence vers la MMVR du groupe est portée par le
          // wrapper VariableRepresentation, quel que soit le type ; une MMVR modifiée localement
          // (variable seule utilisatrice) embarque aussi l'item, sa CodeList et ses catégories —
          // mêmes IDs, modification en place.
          if (localVar.missingValuesReference) {
            variableRepresentation = {
              ...(variableRepresentation ?? {}),
              MissingValuesReference: localVar.missingValuesReference,
            };
            if (localVar.sentinelMmvr) {
              mmvrMap.set(localVar.sentinelMmvr.ID, localVar.sentinelMmvr);
            }
            if (localVar.sentinelCodeList) {
              codeListMap.set(localVar.sentinelCodeList.ID, localVar.sentinelCodeList);
            }
            localVar.sentinelCategories?.forEach((cat) => {
              categoryMap.set(cat.ID, cat);
            });
          }

          const ddiVariable: Variable = {
            $type: "Variable",
            VersionDate: { DateTime: new Date().toISOString() },
            URN: `urn:ddi:${agencyId}:${localVar.id}:1`,
            Agency: agencyId!,
            ID: localVar.id,
            Version: "1",
            VariableName: singletonEntries("fr-FR", localVar.name),
            Label: singletonEntries("fr-FR", localVar.label),
            ...(localVar.description && {
              Description: singletonEntries("fr-FR", localVar.description),
            }),
            ...(localVar.isGeographic && {
              IsGeographic: true,
            }),
            ...(variableRepresentation && {
              VariableRepresentation: variableRepresentation,
            }),
          };

          variableMap.set(localVar.id, ddiVariable);
        });

        variables = Array.from(variableMap.values());
      }

      // Mettre à jour les références de variables dans le premier LogicalRecord
      const dataRelationships = itemsOfType(data, "DataRelationship").map((dr, index) => {
        if (index !== 0 || !dr.LogicalRecord?.[0]) return dr;

        const variableReferences = variables.map((v: Variable) => ({
          $type: "Variable" as const,
          URN: `urn:ddi:${agencyId}:${v.ID}:1`,
          Agency: agencyId!,
          ID: v.ID,
          Version: "1",
        }));

        return {
          ...dr,
          LogicalRecord: dr.LogicalRecord?.map((lr: LogicalRecord, lrIndex: number) =>
            lrIndex === 0
              ? { ...lr, VariablesInRecord: { VariableUsedReference: variableReferences } }
              : lr,
          ),
        };
      });

      let mergedData = replaceItemsOfType(data ?? {}, "Variable", variables);
      mergedData = replaceItemsOfType(mergedData, "CodeList", Array.from(codeListMap.values()));
      mergedData = replaceItemsOfType(mergedData, "Category", Array.from(categoryMap.values()));
      mergedData = replaceItemsOfType(
        mergedData,
        "ManagedMissingValuesRepresentation",
        Array.from(mmvrMap.values()),
      );
      mergedData = replaceItemsOfType(mergedData, "DataRelationship", dataRelationships);

      await savePhysicalInstance.mutateAsync({
        id: id!,
        agencyId: agencyId!,
        data: mergedData,
      });

      // Nettoyer les variables locales après une sauvegarde réussie
      dispatch(actions.clearLocalVariables());

      // Valeurs sentinelles (#1566) : la sauvegarde peut avoir modifié une MMVR / sa CodeList ou
      // changé ses usages — invalider les caches correspondants pour relire l'état réel.
      queryClient.invalidateQueries({ queryKey: ["mmvrUsers"] });
      queryClient.invalidateQueries({ queryKey: ["groupMissingValuesRepresentations"] });
      queryClient.invalidateQueries({ queryKey: ["mutualizedCodesList"] });

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.saveAllSuccess"),
        detail: t("physicalInstance.view.saveAllSuccessDetail"),
        life: TOAST_DURATION,
      });
    } catch (err: unknown) {
      const errorMessage = getApiErrorMessage(err, t("physicalInstance.view.saveAllErrorDetail"));

      toast.current?.show({
        severity: "error",
        summary: t("physicalInstance.view.saveAllError"),
        detail: errorMessage,
        life: TOAST_DURATION,
      });
    }
  }, [id, agencyId, data, state.localVariables, state.deletedVariableIds, savePhysicalInstance, t]);

  // Sauvegarde globale : la variable ouverte dans le panneau latéral peut porter des
  // modifications non validées par « Mettre à jour » — elles ne sont pas dans `localVariables`
  // et seraient donc perdues sans avertissement. On confirme avant de sauvegarder sans elles.
  const handleSaveAll = useCallback(() => {
    if (!isEditedVariableDirty) {
      return saveAll();
    }

    confirmDialog({
      message: t("physicalInstance.view.pendingVariableEdit.message"),
      header: t("physicalInstance.view.pendingVariableEdit.title"),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: t("physicalInstance.view.pendingVariableEdit.confirm"),
      rejectLabel: t("physicalInstance.view.pendingVariableEdit.cancel"),
      acceptClassName: "p-button-warning",
      accept: () => {
        void saveAll();
      },
    });
  }, [isEditedVariableDirty, saveAll, t]);

  // Ouvre la modale de duplication (la duplication n'est plus immédiate, cf. #1555).
  const handleDuplicatePhysicalInstance = useCallback(() => {
    setDuplicateDialogVisible(true);
  }, []);

  // Libellé pré-rempli = libellé courant + suffixe « (copy) » ; Groupe/Étude pré-remplis
  // depuis les parents de la PI courante (le Groupe sera verrouillé, l'Étude modifiable).
  const duplicateInitialData = useMemo(
    () => ({
      label: `${title} (copy)`,
      group: currentGroup,
      studyUnit: currentStudyUnit,
    }),
    [title, currentGroup, currentStudyUnit],
  );

  const handleConfirmDuplicate = useCallback(
    async (formData: PhysicalInstanceCreationData) => {
      try {
        const { duplicatedData, newPhysicalInstanceId, newAgencyId } =
          buildDuplicatedPhysicalInstance({
            agencyId: agencyId!,
            data,
            label: formData.label,
            defaultLocale,
          });

        // 1) Publier le DDI dupliqué (PUT brut : ne porte ni Groupe ni Étude).
        await savePhysicalInstance.mutateAsync({
          id: newPhysicalInstanceId,
          agencyId: newAgencyId,
          data: duplicatedData,
        });

        // 2) Rattacher la PI dupliquée au Groupe verrouillé et à l'Étude choisie via
        // l'endpoint dédié (le PUT brut ne sait pas faire ce rattachement, cf. #1555).
        await updatePhysicalInstance.mutateAsync({
          id: newPhysicalInstanceId,
          agencyId: newAgencyId,
          data: {
            physicalInstanceLabel: formData.label,
            dataRelationshipLabel: formData.dataRelationshipLabel,
            logicalRecordLabel: formData.logicalRecordLabel,
            groupId: formData.group.id,
            groupAgency: formData.group.agency,
            studyUnitId: formData.studyUnit.id,
            studyUnitAgency: formData.studyUnit.agency,
          },
        });

        setDuplicateDialogVisible(false);
        navigate(`/ddi/physical-instances/${newAgencyId}/${newPhysicalInstanceId}`);

        toast.current?.show({
          severity: "success",
          summary: t("physicalInstance.view.duplicateSuccess"),
          detail: t("physicalInstance.view.duplicateSuccessDetail"),
          life: TOAST_DURATION,
        });
      } catch (err) {
        const errorMessage = getApiErrorMessage(
          err,
          t("physicalInstance.view.duplicateErrorDetail"),
        );

        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.duplicateError"),
          detail: errorMessage,
          life: TOAST_DURATION,
        });
      }
    },
    [agencyId, data, defaultLocale, savePhysicalInstance, updatePhysicalInstance, navigate, t],
  );

  if (isLoading) {
    return <LoadingOverlay textType="loading" />;
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
    <>
      <div className={cx("pi-layout", state.selectedVariable && "pi-open")} role="main">
        <div className="pi-col-main">
          <div className="sticky-header">
            <PhysicalInstanceHeader
              label={state.formData.label || title}
              onSave={handleSaveEdit}
              group={currentGroup}
              studyUnit={currentStudyUnit}
              groupLabel={currentGroup?.label}
              studyUnitLabel={currentStudyUnit?.label}
              physicalInstance={{ agency: agencyId!, id: id! }}
              stamps={currentStamps}
            />

            <SearchFilters
              searchValue={state.searchValue}
              onSearchChange={handleSearchChange}
              typeFilter={state.typeFilter}
              onTypeFilterChange={handleTypeFilterChange}
              typeOptions={typeOptions}
              onNewVariable={handleNewVariable}
              onSaveAll={handleSaveAll}
              hasLocalChanges={hasUnsavedChanges}
              stamps={currentStamps}
            />
          </div>

          <GlobalActionsCard
            variables={filteredVariables}
            onExport={handleExport}
            onDuplicate={handleDuplicatePhysicalInstance}
            onValidateDdi4={handleValidateDdi4}
            onRowClick={handleVariableClick}
            onDeleteClick={handleDeleteVariable}
            unsavedVariableIds={unsavedVariableIds}
            selectedVariableId={state.selectedVariable?.id}
            stamps={currentStamps}
          />
        </div>
        <div className="pi-col-side">
          {state.selectedVariable && (
            <div className="variable-edit-sidebar" role="complementary">
              <VariableEditForm
                variable={state.selectedVariable}
                typeOptions={variableTypeOptions}
                locallyUsedMmvrIds={locallyUsedMmvrIds}
                isNew={state.selectedVariable.id === "new"}
                onSave={handleVariableSave}
                onDirtyChange={setEditedVariableDirty}
                onDuplicate={handleVariableDuplicate}
                onPrevious={handlePreviousVariable}
                onNext={handleNextVariable}
                hasPrevious={hasVariablesToNavigate}
                hasNext={hasVariablesToNavigate}
                stamps={currentStamps}
              />
            </div>
          )}
        </div>
      </div>

      {duplicateDialogVisible && (
        <Suspense fallback={null}>
          <PhysicalInstanceDialog
            visible={duplicateDialogVisible}
            onHide={() => setDuplicateDialogVisible(false)}
            mode="duplicate"
            initialData={duplicateInitialData}
            onSubmitDuplicate={handleConfirmDuplicate}
          />
        </Suspense>
      )}

      {savePhysicalInstance.isPending && <LoadingOverlay textType="saving" />}

      {isValidating && <LoadingOverlay text={t("physicalInstance.view.validateDdi4InProgress")} />}

      {/* resizable={false} : PrimeReact rend les Dialog redimensionnables par défaut,
          ce qui n'a pas de sens pour une simple confirmation. */}
      <ConfirmDialog resizable={false} />
      <Toast ref={toast} />
      <DdiDevTools data={data} dataByLangs={dataByLangs} />
    </>
  );
};
