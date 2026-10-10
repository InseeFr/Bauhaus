import { useCallback, useReducer, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { TabView, TabPanel } from "@components/ui/tab-view";

import { cx } from "@utils/cx";

import { HasAccess } from "../../../../auth/components/auth";
import type {
  NumericRepresentation,
  DateTimeRepresentation,
  TextRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
  ManagedMissingValuesRepresentation,
  Reference,
} from "../../types/api";
import { SharedVariableNotice } from "../SharedVariable/SharedVariableNotice";
import type { PhysicalInstanceSummary } from "../SharedVariable/sharedVariables";
import { DdiPreview } from "./DdiPreview";
import { VariableInformationTab } from "./VariableInformationTab";
import { VariableRepresentationTab } from "./VariableRepresentationTab";
import { getVariableValidationErrors } from "./variableValidation";

const VARIABLE_TYPES = {
  NUMERIC: "numeric",
  DATE: "date",
  TEXT: "text",
  CODE: "code",
} as const;

type VariableType = (typeof VARIABLE_TYPES)[keyof typeof VARIABLE_TYPES];

interface VariableRepresentationState {
  NumericRepresentation?: NumericRepresentation;
  DateTimeRepresentation?: DateTimeRepresentation;
  TextRepresentation?: TextRepresentation;
  CodeRepresentation?: CodeRepresentation;
  CodeList?: CodeList;
  Category?: Category[];
  // Valeurs sentinelles (#1566), communes aux quatre types : référence + modifications locales
  // matérialisées (MMVR/CodeList/Categories) quand la variable est seule utilisatrice.
  MissingValuesReference?: Reference;
  SentinelMmvr?: ManagedMissingValuesRepresentation;
  SentinelCodeList?: CodeList;
  SentinelCategories?: Category[];
}

interface FormState {
  /**
   * Identité de la variable dont cet état est la photo. Portée par l'état (et non lue sur la prop
   * `variable`) pour que l'id et la représentation soient toujours ceux d'une même variable : la
   * prop change un rendu avant la réinitialisation de l'état, et les enfants verraient sinon le
   * nouvel id sur l'ancienne représentation.
   */
  id: string;
  label: string;
  name: string;
  description: string;
  selectedType: string;
  isGeographic: boolean;
  representation: VariableRepresentationState;
}

type FormAction =
  | { type: "SET_LABEL"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | {
      type: "SET_NUMERIC_REPRESENTATION";
      payload: NumericRepresentation | undefined;
    }
  | {
      type: "SET_DATE_REPRESENTATION";
      payload: DateTimeRepresentation | undefined;
    }
  | { type: "SET_TEXT_REPRESENTATION"; payload: TextRepresentation | undefined }
  | {
      type: "SET_CODE_REPRESENTATION";
      payload: {
        codeRep: CodeRepresentation | undefined;
        codeList?: CodeList;
        categories?: Category[];
      };
    }
  | {
      type: "SET_SENTINEL_VALUES";
      payload: {
        missingValuesReference: Reference | undefined;
        mmvr?: ManagedMissingValuesRepresentation;
        sentinelCodeList?: CodeList;
        sentinelCategories?: Category[];
      };
    }
  | { type: "RESET"; payload: FormState };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_LABEL":
      return { ...state, label: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_TYPE":
      return { ...state, selectedType: action.payload };
    case "SET_NUMERIC_REPRESENTATION":
      return {
        ...state,
        representation: {
          ...state.representation,
          NumericRepresentation: action.payload,
        },
      };
    case "SET_DATE_REPRESENTATION":
      return {
        ...state,
        representation: {
          ...state.representation,
          DateTimeRepresentation: action.payload,
        },
      };
    case "SET_TEXT_REPRESENTATION":
      return {
        ...state,
        representation: {
          ...state.representation,
          TextRepresentation: action.payload,
        },
      };
    case "SET_CODE_REPRESENTATION":
      return {
        ...state,
        representation: {
          ...state.representation,
          CodeRepresentation: action.payload.codeRep,
          CodeList: action.payload.codeList,
          Category: action.payload.categories,
        },
      };
    case "SET_SENTINEL_VALUES":
      return {
        ...state,
        representation: {
          ...state.representation,
          MissingValuesReference: action.payload.missingValuesReference,
          SentinelMmvr: action.payload.mmvr,
          SentinelCodeList: action.payload.sentinelCodeList,
          SentinelCategories: action.payload.sentinelCategories,
        },
      };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

interface VariableFormData {
  id: string;
  label: string;
  name: string;
  /** VersionDate stockée ; absente pour une variable créée localement et pas encore enregistrée. */
  versionDate?: string;
  description?: string;
  type: string;
  isGeographic?: boolean;
  numericRepresentation?: NumericRepresentation;
  dateRepresentation?: DateTimeRepresentation;
  textRepresentation?: TextRepresentation;
  codeRepresentation?: CodeRepresentation;
  codeList?: CodeList;
  categories?: Category[];
  missingValuesReference?: Reference;
  sentinelMmvr?: ManagedMissingValuesRepresentation;
  sentinelCodeList?: CodeList;
  sentinelCategories?: Category[];
}

function buildFormState(variable: VariableFormData): FormState {
  return {
    id: variable.id,
    label: variable.label,
    name: variable.name,
    description: variable.description || "",
    selectedType: variable.type,
    isGeographic: variable.isGeographic || false,
    representation: {
      NumericRepresentation: variable.numericRepresentation,
      DateTimeRepresentation: variable.dateRepresentation,
      TextRepresentation: variable.textRepresentation,
      CodeRepresentation: variable.codeRepresentation,
      CodeList: variable.codeList,
      Category: variable.categories,
      MissingValuesReference: variable.missingValuesReference,
      SentinelMmvr: variable.sentinelMmvr,
      SentinelCodeList: variable.sentinelCodeList,
      SentinelCategories: variable.sentinelCategories,
    },
  };
}

interface VariableEditFormProps {
  variable: VariableFormData;
  typeOptions: { label: string; value: string }[];
  /** MMVR référencées par les autres variables locales non sauvegardées (règle RO/RW sentinelles). */
  locallyUsedMmvrIds?: string[];
  /** Autres fichiers de l'étude qui utilisent cette variable : la modifier les mettra à jour (#1387). */
  otherPhysicalInstances?: PhysicalInstanceSummary[];
  isNew?: boolean;
  onSave: (data: VariableFormData) => void;
  /**
   * Notifie le parent des modifications non sauvegardées du formulaire, pour qu'il puisse
   * confirmer avant une action globale (sauvegarde de la page) qui les perdrait.
   */
  onDirtyChange?: (isDirty: boolean) => void;
  onDuplicate?: (data: VariableFormData) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  /** Ferme le panneau latéral d'édition (équivalent de la touche Échap). */
  onClose?: () => void;
  /** Stamps créateurs du groupe parent — gating STAMP des boutons UPDATE. */
  stamps?: string[];
}

export const VariableEditForm = ({
  variable,
  typeOptions,
  locallyUsedMmvrIds,
  otherPhysicalInstances = [],
  isNew = false,
  onSave,
  onDirtyChange,
  onDuplicate,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  onClose,
  stamps,
}: Readonly<VariableEditFormProps>) => {
  const { t } = useTranslation();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = Number(searchParams.get("tab"));
  const activeTabIndex = [0, 1, 2].includes(tabParam) ? tabParam : 0;
  const [activeIndex, setInternalActiveIndex] = useState(activeTabIndex);

  const setActiveIndex = useCallback(
    (index: number) => {
      setInternalActiveIndex(index);
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

  useEffect(() => {
    if (activeTabIndex !== activeIndex) {
      setInternalActiveIndex(activeTabIndex);
    }
  }, [activeTabIndex]);

  const [state, dispatch] = useReducer(formReducer, variable, buildFormState);

  // Indicateur d'erreur de l'onglet : le blocage n'a lieu qu'au « Sauvegarder » global (#1608).
  const hasValidationErrors =
    getVariableValidationErrors({
      name: state.name,
      label: state.label,
      sentinelMmvr: state.representation.SentinelMmvr,
    }).length > 0;

  // Modifications pas encore reportées dans le tableau : l'état courant du formulaire comparé à
  // l'état initial dérivé de `variable`. Une variable en création laissée vierge n'est pas
  // modifiée : fermer le panneau ne doit pas ajouter de ligne vide.
  const isDirty = JSON.stringify(state) !== JSON.stringify(buildFormState(variable));

  // Le callback du parent est lu via une ref pour que la notification ne dépende pas de la
  // stabilité de son identité (sinon le nettoyage de démontage se déclencherait à chaque rendu).
  const onDirtyChangeRef = useRef(onDirtyChange);
  useEffect(() => {
    onDirtyChangeRef.current = onDirtyChange;
  });

  useEffect(() => {
    onDirtyChangeRef.current?.(isDirty);
  }, [isDirty]);

  // Le panneau fermé, il n'y a plus rien à reporter.
  useEffect(() => () => onDirtyChangeRef.current?.(false), []);

  useEffect(() => {
    // Réinitialiser l'onglet actif au premier onglet uniquement pour une nouvelle variable
    if (isNew) {
      setActiveIndex(0);
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }

    dispatch({ type: "RESET", payload: buildFormState(variable) });
    // Ne pas inclure codeList et categories dans les dépendances car ils changent
    // pendant l'édition et on ne veut pas réinitialiser le formulaire à chaque fois
  }, [
    variable.id,
    variable.label,
    variable.name,
    variable.description,
    variable.type,
    variable.isGeographic,
    variable.numericRepresentation,
    variable.dateRepresentation,
    variable.textRepresentation,
    variable.codeRepresentation,
    isNew,
  ]);

  const updateNumericRepresentation = useCallback(
    (numericRep: NumericRepresentation | undefined) => {
      dispatch({ type: "SET_NUMERIC_REPRESENTATION", payload: numericRep });
    },
    [],
  );

  const updateDateRepresentation = useCallback((dateRep: DateTimeRepresentation | undefined) => {
    dispatch({ type: "SET_DATE_REPRESENTATION", payload: dateRep });
  }, []);

  const updateTextRepresentation = useCallback((textRep: TextRepresentation | undefined) => {
    dispatch({ type: "SET_TEXT_REPRESENTATION", payload: textRep });
  }, []);

  const updateCodeRepresentation = useCallback(
    (codeRep: CodeRepresentation | undefined, codeList?: CodeList, categories?: Category[]) => {
      dispatch({
        type: "SET_CODE_REPRESENTATION",
        payload: { codeRep, codeList, categories },
      });
    },
    [],
  );

  const updateSentinelValues = useCallback(
    (
      missingValuesReference: Reference | undefined,
      mmvr?: ManagedMissingValuesRepresentation,
      sentinelCodeList?: CodeList,
      sentinelCategories?: Category[],
    ) => {
      dispatch({
        type: "SET_SENTINEL_VALUES",
        payload: { missingValuesReference, mmvr, sentinelCodeList, sentinelCategories },
      });
    },
    [],
  );

  const buildSavePayload = useCallback(() => {
    // Valeurs sentinelles (#1566) : communes aux quatre types de représentation.
    const basePayload = {
      id: variable.id,
      label: state.label,
      name: state.name,
      description: state.description,
      type: state.selectedType,
      isGeographic: state.isGeographic,
      missingValuesReference: state.representation.MissingValuesReference,
      sentinelMmvr: state.representation.SentinelMmvr,
      sentinelCodeList: state.representation.SentinelCodeList,
      sentinelCategories: state.representation.SentinelCategories,
    };

    switch (state.selectedType as VariableType) {
      case VARIABLE_TYPES.NUMERIC:
        return {
          ...basePayload,
          numericRepresentation: state.representation.NumericRepresentation,
        };
      case VARIABLE_TYPES.DATE:
        return {
          ...basePayload,
          dateRepresentation: state.representation.DateTimeRepresentation,
        };
      case VARIABLE_TYPES.TEXT:
        return {
          ...basePayload,
          textRepresentation: state.representation.TextRepresentation,
        };
      case VARIABLE_TYPES.CODE:
        // Les lignes vides en cours de saisie sont conservées : retirées ici, elles disparaîtraient
        // du formulaire réinitialisé depuis le tableau à chaque report (#1608). Le filtrage a lieu
        // au « Sauvegarder » global.
        return {
          ...basePayload,
          codeRepresentation: state.representation.CodeRepresentation,
          codeList: state.representation.CodeList,
          categories: state.representation.Category,
        };
      default:
        return basePayload;
    }
  }, [variable.id, state]);

  // Report dans le tableau (#1608) : à la sortie d'un champ modifié, et à la fermeture du panneau
  // ou au changement de variable pour une saisie qui n'aurait pas encore été quittée. Un même état
  // n'est reporté qu'une fois : une variable créée change d'id juste après son premier report, et
  // ne doit pas être ajoutée une seconde fois.
  const lastCommittedStateRef = useRef<FormState | null>(null);
  const commitChanges = useCallback(() => {
    if (!isDirty || lastCommittedStateRef.current === state) return;
    lastCommittedStateRef.current = state;
    onSave(buildSavePayload());
  }, [isDirty, state, onSave, buildSavePayload]);

  const commitChangesRef = useRef(commitChanges);
  useEffect(() => {
    commitChangesRef.current = commitChanges;
  });
  // Le nettoyage s'exécute avant la mise à jour de la ref : il voit encore la variable quittée.
  useEffect(() => () => commitChangesRef.current(), [variable.id]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      commitChanges();
    },
    [commitChanges],
  );

  const handleDuplicate = useCallback(() => {
    const currentData = buildSavePayload();
    const duplicatedData = {
      ...currentData,
      id: crypto.randomUUID(),
      name: `${currentData.name} (copy)`,
      label: `${currentData.label} (copy)`,
    };
    onDuplicate?.(duplicatedData);
  }, [buildSavePayload, onDuplicate]);

  return (
    <Card
      title={
        isNew
          ? t("physicalInstance.view.newVariable")
          : `${t("physicalInstance.view.editVariable")} - ${variable.name}`
      }
      className="h-full"
    >
      <form onSubmit={handleSubmit} onBlur={commitChanges} className="flex flex-column gap-3">
        <div className="flex gap-2 justify-content-end">
          <HasAccess module="DDI_PHYSICALINSTANCE" privilege="UPDATE" stamps={stamps}>
            <Button
              type="button"
              label={t("physicalInstance.view.duplicate")}
              icon="pi pi-copy"
              outlined
              severity="secondary"
              onClick={handleDuplicate}
            />
          </HasAccess>
          <Button
            type="button"
            icon="pi pi-chevron-left"
            outlined
            severity="secondary"
            onClick={onPrevious}
            disabled={!hasPrevious || isNew}
            aria-label={t("physicalInstance.view.previousVariable")}
          />
          <Button
            type="button"
            icon="pi pi-chevron-right"
            outlined
            severity="secondary"
            onClick={onNext}
            disabled={!hasNext || isNew}
            aria-label={t("physicalInstance.view.nextVariable")}
          />
          {onClose && (
            <Button
              type="button"
              icon="pi pi-times"
              text
              severity="secondary"
              onClick={onClose}
              aria-label={t("physicalInstance.view.closeVariablePanel")}
              tooltip={t("physicalInstance.view.closeVariablePanel")}
              tooltipOptions={{ position: "left" }}
            />
          )}
        </div>

        <SharedVariableNotice otherPhysicalInstances={otherPhysicalInstances} />

        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel
            headerTemplate={(options) => {
              return (
                <div
                  className={cx(options.className, "flex align-items-center gap-2")}
                  onClick={options.onClick}
                >
                  <span className={hasValidationErrors ? "text-red-500" : ""}>
                    {t("physicalInstance.view.tabs.information")}
                  </span>
                  {hasValidationErrors && (
                    <span
                      className="inline-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        borderRadius: "50%",
                        width: "1.25rem",
                        height: "1.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      !
                    </span>
                  )}
                </div>
              );
            }}
          >
            <VariableInformationTab
              name={state.name}
              label={state.label}
              description={state.description}
              onNameChange={(value) => dispatch({ type: "SET_NAME", payload: value })}
              onLabelChange={(value) => dispatch({ type: "SET_LABEL", payload: value })}
              onDescriptionChange={(value) => dispatch({ type: "SET_DESCRIPTION", payload: value })}
              nameError={!state.name.trim()}
              labelError={!state.label.trim()}
              nameInputRef={nameInputRef}
            />
          </TabPanel>

          <TabPanel
            headerTemplate={(options) => {
              return (
                <div
                  className={cx(options.className, "flex align-items-center gap-2")}
                  onClick={options.onClick}
                >
                  <span>{t("physicalInstance.view.tabs.representation")}</span>
                </div>
              );
            }}
          >
            <VariableRepresentationTab
              variableId={state.id}
              variableName={state.name}
              selectedType={state.selectedType}
              typeOptions={typeOptions}
              numericRepresentation={state.representation.NumericRepresentation}
              dateRepresentation={state.representation.DateTimeRepresentation}
              textRepresentation={state.representation.TextRepresentation}
              codeRepresentation={state.representation.CodeRepresentation}
              codeList={state.representation.CodeList}
              categories={state.representation.Category}
              missingValuesReference={state.representation.MissingValuesReference}
              sentinelMmvr={state.representation.SentinelMmvr}
              sentinelCodeList={state.representation.SentinelCodeList}
              sentinelCategories={state.representation.SentinelCategories}
              locallyUsedMmvrIds={locallyUsedMmvrIds}
              onTypeChange={(value) => dispatch({ type: "SET_TYPE", payload: value })}
              onNumericRepresentationChange={updateNumericRepresentation}
              onDateRepresentationChange={updateDateRepresentation}
              onTextRepresentationChange={updateTextRepresentation}
              onCodeRepresentationChange={updateCodeRepresentation}
              onSentinelValuesChange={updateSentinelValues}
            />
          </TabPanel>

          <TabPanel
            headerClassName="ml-auto"
            headerTemplate={(options) => {
              return (
                <div
                  className={cx(options.className, "flex align-items-center gap-2")}
                  onClick={options.onClick}
                >
                  <i
                    className="pi pi-code"
                    style={{ lineHeight: "inherit" }}
                    aria-label={t("physicalInstance.view.tabs.ddiPreview")}
                  />
                </div>
              );
            }}
          >
            {activeIndex === 2 && (
              <DdiPreview
                variableId={state.id}
                variableName={state.name}
                variableLabel={state.label}
                variableDescription={state.description}
                variableType={state.selectedType}
                isGeographic={state.isGeographic}
                numericRepresentation={state.representation.NumericRepresentation}
                dateRepresentation={state.representation.DateTimeRepresentation}
                textRepresentation={state.representation.TextRepresentation}
                codeRepresentation={state.representation.CodeRepresentation}
                codeList={state.representation.CodeList}
                categories={state.representation.Category}
                missingValuesReference={state.representation.MissingValuesReference}
                sentinelMmvr={state.representation.SentinelMmvr}
                sentinelCodeList={state.representation.SentinelCodeList}
                sentinelCategories={state.representation.SentinelCategories}
                variableVersionDate={variable.versionDate}
              />
            )}
          </TabPanel>
        </TabView>
      </form>
    </Card>
  );
};
