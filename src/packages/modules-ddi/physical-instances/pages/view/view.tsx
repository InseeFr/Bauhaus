import { useQueryClient } from "@tanstack/react-query";
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
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useSearchParams } from "react-router";

import { ConfirmDialog, confirmDialog } from "@components/ui/confirm-dialog";
import { Toast } from "@components/ui/toast";

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
import { LoadingErrorBloc } from "@components/errors-bloc";
import { LoadingOverlay } from "@components/loading-overlay";

import { formatApiErrors } from "@utils/api-errors";
import { cx } from "@utils/cx";
import { useNavigationBlocker } from "@utils/hooks/useNavigationBlocker";

import { appI18n } from "../../../../i18n";
import { useDuplicatePhysicalInstance } from "../../../hooks/useDuplicatePhysicalInstance";
import { useExport } from "../../../hooks/useExport";
import { usePhysicalInstancesData } from "../../../hooks/usePhysicalInstance";
import { usePhysicalInstanceByLangs } from "../../../hooks/usePhysicalInstanceByLangs";
import { usePhysicalInstanceParents } from "../../../hooks/usePhysicalInstanceParents";
import { usePublishPhysicalInstance } from "../../../hooks/usePublishPhysicalInstance";
import { useStudyUnitVariableUsages } from "../../../hooks/useStudyUnitVariables";
import { useUpdatePhysicalInstance } from "../../../hooks/useUpdatePhysicalInstance";
import { useValidateDdi4 } from "../../../hooks/useValidateDdi4";
import { errorToastTiming } from "../../../utils/error-toast";
import { pickLang, singletonEntries } from "../../../utils/multilingual";
import { DdiDevTools } from "../../components/DdiDevTools/DdiDevTools";
import { DdiToast } from "../../components/DdiToast/DdiToast";
import { GlobalActionsCard } from "../../components/GlobalActionsCard/GlobalActionsCard";
import { SearchFilters } from "../../components/SearchFilters/SearchFilters";
import { ReuseVariableDialog } from "../../components/SharedVariable/ReuseVariableDialog";
import { otherPhysicalInstancesByVariable } from "../../components/SharedVariable/sharedVariables";
import { VariableEditForm } from "../../components/VariableEditForm/VariableEditForm";
import { getVariableValidationErrors } from "../../components/VariableEditForm/variableValidation";
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
import { findLocalCategoryOverrides } from "./findLocalCategoryOverrides";
import { findLocalCodeListOverride } from "./findLocalCodeListOverride";
import { loadCodeListForVariable } from "./loadCodeListForVariable";
import { PhysicalInstanceHeader } from "./PhysicalInstanceHeader";
import { toVariableTableData } from "./toVariableTableData";
import { viewReducer, initialState, actions, type VariableData } from "./viewReducer";

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

  // Une PI introuvable (404) ou en erreur n'a pas de parents à résoudre : on attend son chargement.
  const { data: parents, isLoading: isLoadingParents } = usePhysicalInstanceParents(
    agencyId!,
    id!,
    { enabled: !!data },
  );

  const currentGroup = parents?.group;
  const currentStudyUnit = parents?.studyUnit;
  const currentStamps = parents?.stamps;
  const [duplicateDialogVisible, setDuplicateDialogVisible] = useState(false);
  const [reuseDialogVisible, setReuseDialogVisible] = useState(false);

  // Réutilisation de variables (#1387) : une variable utilisée par d'autres fichiers de l'étude est
  // partagée, la modifier les met à jour. On le signale dans le tableau et dans le panneau.
  const { data: studyUnitVariableUsages } = useStudyUnitVariableUsages(
    currentStudyUnit?.agency ?? "",
    currentStudyUnit?.id ?? "",
  );
  const otherPhysicalInstances = useMemo(
    () =>
      otherPhysicalInstancesByVariable(studyUnitVariableUsages ?? [], {
        agency: agencyId!,
        id: id!,
      }),
    [studyUnitVariableUsages, agencyId, id],
  );
  const sharedVariableIds = useMemo(
    () => Array.from(otherPhysicalInstances.keys()),
    [otherPhysicalInstances],
  );
  // Saisie du panneau d'édition pas encore reportée dans le tableau (champ non quitté).
  const [isEditedVariableDirty, setEditedVariableDirty] = useState(false);
  // Erreurs de validation affichées à partir du premier « Sauvegarder » refusé (#1608).
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isReloadingAfterSave, setReloadingAfterSave] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const updatePhysicalInstance = useUpdatePhysicalInstance();
  const savePhysicalInstance = usePublishPhysicalInstance();
  const duplicatePhysicalInstance = useDuplicatePhysicalInstance();
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

  const handleCloseVariablePanel = useCallback(() => {
    dispatch(actions.setSelectedVariable(null));
  }, []);

  // Fermer le panneau latéral d'édition avec la touche Échap
  useEffect(() => {
    if (!state.selectedVariable) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseVariablePanel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedVariable, handleCloseVariablePanel]);

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
    return [...state.localVariables.map((v) => v.id), ...state.reusedVariables.map((v) => v.ID)];
  }, [state.localVariables, state.reusedVariables]);

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
    return (
      state.localVariables.length > 0 ||
      state.deletedVariableIds.length > 0 ||
      state.reusedVariables.length > 0 ||
      isEditedVariableDirty
    );
  }, [
    state.localVariables,
    state.deletedVariableIds,
    state.reusedVariables,
    isEditedVariableDirty,
  ]);

  // Validation globale (#1608) : toutes les variables modifiées, recalculée à chaque report pour
  // que les erreurs corrigées disparaissent aussitôt.
  const variablesInError = useMemo(
    () =>
      state.localVariables
        .map((variable) => ({
          variable,
          errors: getVariableValidationErrors({
            name: variable.name,
            label: variable.label,
            sentinelMmvr: variable.sentinelMmvr,
          }),
        }))
        .filter(({ errors }) => errors.length > 0),
    [state.localVariables],
  );
  const displayedVariablesInError = showValidationErrors ? variablesInError : [];
  const invalidVariableIds = useMemo(
    () => displayedVariablesInError.map(({ variable }) => variable.id),
    [displayedVariablesInError],
  );

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
    // Les variables réutilisées non encore enregistrées s'affichent comme les variables relues.
    const variableMap = new Map<string, VariableTableData>(
      [...variables, ...state.reusedVariables.map((v) => toVariableTableData(v))].map((v) => [
        v.id,
        v,
      ]),
    );

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
  }, [
    variables,
    state.reusedVariables,
    state.localVariables,
    state.deletedVariableIds,
    state.newVariableAnchors,
  ]);

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

        const errorMessage = formatApiErrors(
          err,
          appI18n,
          t("physicalInstance.view.saveErrorDetail"),
        ).join("\n");

        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.saveError"),
          detail: errorMessage,
          ...errorToastTiming(),
        });

        throw err;
      }
    },
    [id, agencyId, t, updatePhysicalInstance, state.formData.label],
  );

  const handleVariableClick = useCallback(
    // `storedVariable` : l'item à ouvrir quand il n'est pas encore dans l'état (variable tout juste
    // réutilisée, #1387).
    async (variable: VariableTableData, storedVariable?: Variable) => {
      // Vérifier d'abord si la variable a des modifications locales
      const localVariable = state.localVariables.find((v) => v.id === variable.id);

      if (localVariable) {
        // Utiliser les données locales si elles existent
        dispatch(actions.setSelectedVariable(localVariable));
        return;
      }

      // Sinon, trouver la variable complète dans les données brutes
      const fullVariable =
        storedVariable ??
        [...itemsOfType(data, "Variable"), ...state.reusedVariables].find(
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

        let loaded;
        try {
          loaded = await loadCodeListForVariable(queryClient, codeRepresentation, {
            skipMutualized: true,
          });
        } catch (err: unknown) {
          // Sans sa liste de codes, la variable ne peut pas être éditée : on le dit et on la
          // laisse fermée, plutôt que de laisser l'échec sans réponse.
          toast.current?.show({
            severity: "error",
            summary: t("physicalInstance.view.code.loadCodeListErrorTitle"),
            detail: formatApiErrors(
              err,
              appI18n,
              t("physicalInstance.view.code.loadCodeListErrorDetail"),
            ).join("\n"),
            ...errorToastTiming(),
          });
          return;
        }
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
            ...errorToastTiming(),
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
    [data, state.localVariables, state.reusedVariables, queryClient, t, agencyId],
  );

  // Réutilisation (#1387) : la variable choisie rejoint la PI telle quelle, et s'ouvre dans le
  // panneau — le bandeau y signale aussitôt les autres fichiers qui la partagent.
  const handleReuseVariable = useCallback(
    (variable: Variable) => {
      dispatch(actions.reuseVariable(variable));
      setReuseDialogVisible(false);
      void handleVariableClick(toVariableTableData(variable), variable);
    },
    [handleVariableClick],
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
          void handleVariableClick(variable);
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
      void handleVariableClick(filteredVariables[previousIndex]);
    }
  }, [currentVariableIndex, filteredVariables, handleVariableClick]);

  const handleNextVariable = useCallback(() => {
    if (currentVariableIndex >= 0 && filteredVariables.length > 0) {
      const nextIndex =
        currentVariableIndex === filteredVariables.length - 1 ? 0 : currentVariableIndex + 1;
      void handleVariableClick(filteredVariables[nextIndex]);
    }
  }, [currentVariableIndex, filteredVariables, handleVariableClick]);

  // Report d'une saisie du panneau dans le tableau (#1608), sans le fermer : une variable en
  // création reçoit son identifiant au premier report.
  const handleVariableChange = useCallback((data: VariableData) => {
    if (data.id === "new") {
      dispatch(actions.addEditedVariable({ ...data, id: crypto.randomUUID() }));
    } else {
      dispatch(actions.updateVariable(data));
    }
  }, []);

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
      // Les variables réutilisées non modifiées partent telles que stockées (#1387).
      let variables = [...itemsOfType(data, "Variable"), ...state.reusedVariables];
      const codeListMap = new Map(itemsOfType(data, "CodeList").map((cl) => [cl.ID, cl]));
      const categoryMap = new Map(itemsOfType(data, "Category").map((cat) => [cat.ID, cat]));
      // MMVR : valeurs sentinelles, #1566
      const mmvrMap = new Map(
        itemsOfType(data, "ManagedMissingValuesRepresentation").map((mmvr) => [mmvr.ID, mmvr]),
      );

      // Si on a des variables locales, des suppressions ou des réutilisations, mettre à jour les
      // variables (la Map dédoublonne une variable retirée puis réutilisée avant la sauvegarde)
      if (
        state.localVariables.length > 0 ||
        state.deletedVariableIds.length > 0 ||
        state.reusedVariables.length > 0
      ) {
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
          if (localVar.type === VARIABLE_TYPES.TEXT || localVar.textRepresentation) {
            // #1592 : le type Text doit rester explicite dans le DDI, même quand l'utilisateur
            // n'a saisi ni longueur ni expression régulière.
            variableRepresentation = {
              TextRepresentation: localVar.textRepresentation ?? {
                $type: "TextRepresentationBaseType",
              },
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
              ...variableRepresentation,
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

          // Une variable déjà stockée garde son agence et sa version : réécrite en v1 sous l'agence
          // de la PI, elle créait une version fantôme que les autres fichiers ne voyaient pas.
          const storedVariable = variableMap.get(localVar.id);
          const variableAgency = storedVariable?.Agency ?? agencyId!;
          const variableVersion = storedVariable?.Version ?? "1";
          const ddiVariable: Variable = {
            $type: "Variable",
            VersionDate: { DateTime: new Date().toISOString() },
            URN: `urn:ddi:${variableAgency}:${localVar.id}:${variableVersion}`,
            Agency: variableAgency,
            ID: localVar.id,
            Version: variableVersion,
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
          URN: `urn:ddi:${v.Agency}:${v.ID}:${v.Version}`,
          Agency: v.Agency,
          ID: v.ID,
          Version: v.Version,
        }));

        return {
          ...dr,
          LogicalRecord: dr.LogicalRecord?.map((lr: LogicalRecord, lrIndex: number) =>
            lrIndex === 0
              ? {
                  ...lr,
                  VariablesInRecord: {
                    VariableUsedReference: variableReferences,
                  },
                }
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

      // Le PUT a déjà lancé (via l'invalidation) le GET de la PI : on l'attend sous un loader
      // dédié, pour ne rendre la main qu'une fois l'état relu du serveur affiché.
      // `cancelRefetch: false` réutilise ce GET en vol au lieu d'en relancer un second.
      setReloadingAfterSave(true);
      try {
        await queryClient.refetchQueries(
          { queryKey: ["physicalInstanceById", agencyId, id], exact: true },
          { cancelRefetch: false },
        );
      } finally {
        setReloadingAfterSave(false);
      }

      // Nettoyer les variables locales après une sauvegarde réussie
      dispatch(actions.clearLocalVariables());
      setShowValidationErrors(false);

      // Valeurs sentinelles (#1566) : la sauvegarde peut avoir modifié une MMVR / sa CodeList ou
      // changé ses usages — invalider les caches correspondants pour relire l'état réel.
      queryClient.invalidateQueries({ queryKey: ["mmvrUsers"] });
      queryClient.invalidateQueries({
        queryKey: ["groupMissingValuesRepresentations"],
      });
      queryClient.invalidateQueries({ queryKey: ["mutualizedCodeList"] });

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.saveAllSuccess"),
        detail: t("physicalInstance.view.saveAllSuccessDetail"),
        life: TOAST_DURATION,
      });
    } catch (err: unknown) {
      const errorMessage = formatApiErrors(
        err,
        appI18n,
        t("physicalInstance.view.saveAllErrorDetail"),
      ).join("\n");

      toast.current?.show({
        severity: "error",
        summary: t("physicalInstance.view.saveAllError"),
        detail: errorMessage,
        ...errorToastTiming(),
      });
    }
  }, [
    id,
    agencyId,
    data,
    state.localVariables,
    state.deletedVariableIds,
    state.reusedVariables,
    savePhysicalInstance,
    t,
  ]);

  // Sauvegarde globale : la saisie en cours a déjà été reportée dans le tableau en quittant le
  // champ (le clic sur le bouton suffit). Rien n'est envoyé tant qu'une variable modifiée est
  // invalide (#1608).
  const handleSaveAll = useCallback(() => {
    if (variablesInError.length > 0) {
      setShowValidationErrors(true);
      return;
    }
    return saveAll();
  }, [variablesInError, saveAll]);

  const handleInvalidVariableClick = useCallback(
    (variableId: string) => {
      const variable = mergedVariables.find((v) => v.id === variableId);
      if (variable) {
        void handleVariableClick(variable);
      }
    },
    [mergedVariables, handleVariableClick],
  );

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
        // La copie, son rattachement au Groupe verrouillé et à l'Étude choisie, et le rangement de
        // ses variables sont faits par le back en un seul enregistrement.
        const copy = await duplicatePhysicalInstance.mutateAsync({
          agencyId: agencyId!,
          id: id!,
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
        navigate(`/ddi/physical-instances/${copy.agency}/${copy.id}`);

        toast.current?.show({
          severity: "success",
          summary: t("physicalInstance.view.duplicateSuccess"),
          detail: t("physicalInstance.view.duplicateSuccessDetail"),
          life: TOAST_DURATION,
        });
      } catch (err) {
        const errorMessage = formatApiErrors(
          err,
          appI18n,
          t("physicalInstance.view.duplicateErrorDetail"),
        ).join("\n");

        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.duplicateError"),
          detail: errorMessage,
          ...errorToastTiming(),
        });
      }
    },
    [agencyId, id, duplicatePhysicalInstance, navigate, t],
  );

  // Les parents (Groupe / Étude) portent les droits d'édition : sans eux, la page s'afficherait
  // d'abord en lecture seule puis changerait sous les yeux de l'utilisateur.
  if (isLoading || isLoadingParents) {
    return <LoadingOverlay textType="loading" />;
  }

  // Même traitement que les autres fiches ; une instance déjà affichée le reste si un
  // rechargement échoue.
  if (isError && !data) {
    return <LoadingErrorBloc error={error} />;
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
              onReuseVariable={currentStudyUnit ? () => setReuseDialogVisible(true) : undefined}
              onSaveAll={handleSaveAll}
              hasLocalChanges={hasUnsavedChanges}
              stamps={currentStamps}
            />

            {displayedVariablesInError.length > 0 && (
              <div
                role="alert"
                aria-labelledby="pi-validation-summary-title"
                className="pi-validation-summary"
              >
                <p id="pi-validation-summary-title" className="pi-validation-summary-title">
                  <i className="pi pi-times-circle" aria-hidden="true" />
                  {t("physicalInstance.view.validation.summary")}
                </p>
                <ul>
                  {displayedVariablesInError.map(({ variable, errors }) => (
                    <li key={variable.id}>
                      <button
                        type="button"
                        className="pi-validation-summary-variable"
                        onClick={() => handleInvalidVariableClick(variable.id)}
                      >
                        {variable.name.trim() ||
                          variable.label.trim() ||
                          t("physicalInstance.view.validation.unnamedVariable")}
                      </button>
                      {" : "}
                      {errors
                        .map((error) => t(`physicalInstance.view.validation.errors.${error}`))
                        .join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <GlobalActionsCard
            variables={filteredVariables}
            onExport={handleExport}
            onDuplicate={handleDuplicatePhysicalInstance}
            onValidateDdi4={handleValidateDdi4}
            onRowClick={handleVariableClick}
            onDeleteClick={handleDeleteVariable}
            unsavedVariableIds={unsavedVariableIds}
            invalidVariableIds={invalidVariableIds}
            sharedVariableIds={sharedVariableIds}
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
                otherPhysicalInstances={otherPhysicalInstances.get(state.selectedVariable.id)}
                isNew={state.selectedVariable.id === "new"}
                onSave={handleVariableChange}
                onDirtyChange={setEditedVariableDirty}
                onDuplicate={handleVariableDuplicate}
                onPrevious={handlePreviousVariable}
                onNext={handleNextVariable}
                hasPrevious={hasVariablesToNavigate}
                hasNext={hasVariablesToNavigate}
                onClose={handleCloseVariablePanel}
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

      {reuseDialogVisible && currentStudyUnit && (
        <ReuseVariableDialog
          studyUnit={currentStudyUnit}
          excludedVariableIds={mergedVariables.map((variable) => variable.id)}
          onReuse={handleReuseVariable}
          onHide={() => setReuseDialogVisible(false)}
        />
      )}

      {savePhysicalInstance.isPending && <LoadingOverlay textType="saving" />}

      {isReloadingAfterSave && (
        <LoadingOverlay text={t("physicalInstance.view.reloadingAfterSave")} />
      )}

      {isValidating && <LoadingOverlay text={t("physicalInstance.view.validateDdi4InProgress")} />}

      {/* resizable={false} : PrimeReact rend les Dialog redimensionnables par défaut,
          ce qui n'a pas de sens pour une simple confirmation. */}
      <ConfirmDialog resizable={false} />
      <DdiToast ref={toast} />
      <DdiDevTools data={data} dataByLangs={dataByLangs} />
    </>
  );
};
