import { useCallback, useReducer, useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { useTranslation } from "react-i18next";
import type {
  NumericRepresentation,
  DateTimeRepresentation,
  TextRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
} from "../../types/api";
import { DdiXmlPreview } from "./DdiXmlPreview";
import { VariableInformationTab } from "./VariableInformationTab";
import { VariableRepresentationTab } from "./VariableRepresentationTab";

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
}

interface FormState {
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
  | { type: "SET_IS_GEOGRAPHIC"; payload: boolean }
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
    case "SET_IS_GEOGRAPHIC":
      return { ...state, isGeographic: action.payload };
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
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

interface VariableEditFormProps {
  variable: {
    id: string;
    label: string;
    name: string;
    description?: string;
    type: string;
    isGeographic?: boolean;
    numericRepresentation?: NumericRepresentation;
    dateRepresentation?: DateTimeRepresentation;
    textRepresentation?: TextRepresentation;
    codeRepresentation?: CodeRepresentation;
    codeList?: CodeList;
    categories?: Category[];
  };
  typeOptions: { label: string; value: string }[];
  isNew?: boolean;
  onSave: (data: {
    id: string;
    label: string;
    name: string;
    description?: string;
    type: string;
    isGeographic?: boolean;
    numericRepresentation?: NumericRepresentation;
    dateRepresentation?: DateTimeRepresentation;
    textRepresentation?: TextRepresentation;
    codeRepresentation?: CodeRepresentation;
    codeList?: CodeList;
    categories?: Category[];
  }) => void;
  onDuplicate?: (data: {
    id: string;
    label: string;
    name: string;
    description?: string;
    type: string;
    isGeographic?: boolean;
    numericRepresentation?: NumericRepresentation;
    dateRepresentation?: DateTimeRepresentation;
    textRepresentation?: TextRepresentation;
    codeRepresentation?: CodeRepresentation;
    codeList?: CodeList;
    categories?: Category[];
  }) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const VariableEditForm = ({
  variable,
  typeOptions,
  isNew = false,
  onSave,
  onDuplicate,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: Readonly<VariableEditFormProps>) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const [state, dispatch] = useReducer(formReducer, {
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
    },
  });

  // Validation des champs obligatoires
  const hasValidationErrors = !state.name.trim() || !state.label.trim();

  useEffect(() => {
    // Réinitialiser l'onglet actif au premier onglet uniquement pour une nouvelle variable
    if (isNew) {
      setActiveIndex(0);
    }

    dispatch({
      type: "RESET",
      payload: {
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
        },
      },
    });
    // Ne pas inclure codeList et categories dans les dépendances car ils changent
    // pendant l'édition et on ne veut pas réinitialiser le formulaire à chaque fois
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const buildSavePayload = useCallback(() => {
    const basePayload = {
      id: variable.id,
      label: state.label,
      name: state.name,
      description: state.description,
      type: state.selectedType,
      isGeographic: state.isGeographic,
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
      case VARIABLE_TYPES.CODE: {
        const codeList = state.representation.CodeList;
        const categories = state.representation.Category || [];

        // Filtrer les codes vides (sans valeur ET sans label) et les codes invalides
        const validCodes = (codeList?.Code || []).filter((code) => {
          if (!code || !code.CategoryReference) return false;
          const category = categories.find((cat) => cat?.ID === code.CategoryReference?.ID);
          const label = category?.Label?.Content?.["#text"] || "";
          const value = code.Value || "";
          return value.trim() !== "" || label.trim() !== "";
        });

        // Ne garder que les catégories liées aux codes valides
        const validCategoryIds = new Set(validCodes.map((code) => code.CategoryReference?.ID));
        const validCategories = categories.filter((cat) => cat && validCategoryIds.has(cat.ID));

        const filteredCodeList = codeList ? { ...codeList, Code: validCodes } : undefined;

        return {
          ...basePayload,
          codeRepresentation: state.representation.CodeRepresentation,
          codeList: filteredCodeList,
          categories: validCategories,
        };
      }
      default:
        return basePayload;
    }
  }, [variable.id, state]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSave(buildSavePayload());
    },
    [buildSavePayload, onSave],
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
          ? t("physicalInstance.view.editVariable")
          : `${t("physicalInstance.view.editVariable")} - ${variable.name}`
      }
      className="h-full"
    >
      <form onSubmit={handleSubmit} className="flex flex-column gap-3">
        <div className="flex gap-2 justify-content-end">
          <Button
            type="button"
            label={t("physicalInstance.view.duplicate")}
            icon="pi pi-copy"
            outlined
            severity="secondary"
            onClick={handleDuplicate}
          />
          <Button
            type="submit"
            label={isNew ? t("physicalInstance.view.add") : t("physicalInstance.view.update")}
            icon="pi pi-save"
            outlined
            disabled={hasValidationErrors}
            aria-label={isNew ? t("physicalInstance.view.add") : t("physicalInstance.view.update")}
          />
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
        </div>

        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel
            headerTemplate={(options) => {
              return (
                <div
                  className={`${options.className} flex align-items-center gap-2`}
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
            />
          </TabPanel>

          <TabPanel
            headerTemplate={(options) => {
              return (
                <div
                  className={`${options.className} flex align-items-center gap-2`}
                  onClick={options.onClick}
                >
                  <span>{t("physicalInstance.view.tabs.representation")}</span>
                </div>
              );
            }}
          >
            <VariableRepresentationTab
              variableId={variable.id}
              isGeographic={state.isGeographic}
              selectedType={state.selectedType}
              typeOptions={typeOptions}
              numericRepresentation={state.representation.NumericRepresentation}
              dateRepresentation={state.representation.DateTimeRepresentation}
              textRepresentation={state.representation.TextRepresentation}
              codeRepresentation={state.representation.CodeRepresentation}
              codeList={state.representation.CodeList}
              categories={state.representation.Category}
              onIsGeographicChange={(value) =>
                dispatch({ type: "SET_IS_GEOGRAPHIC", payload: value })
              }
              onTypeChange={(value) => dispatch({ type: "SET_TYPE", payload: value })}
              onNumericRepresentationChange={updateNumericRepresentation}
              onDateRepresentationChange={updateDateRepresentation}
              onTextRepresentationChange={updateTextRepresentation}
              onCodeRepresentationChange={updateCodeRepresentation}
            />
          </TabPanel>

          <TabPanel
            headerClassName="ml-auto"
            headerTemplate={(options) => {
              return (
                <div
                  className={`${options.className} flex align-items-center gap-2`}
                  onClick={options.onClick}
                >
                  <i
                    className="pi pi-code"
                    style={{ lineHeight: "inherit" }}
                    aria-label={t("physicalInstance.view.tabs.ddiXml")}
                  />
                </div>
              );
            }}
          >
            {activeIndex === 2 && (
              <DdiXmlPreview
                variableId={variable.id}
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
              />
            )}
          </TabPanel>
        </TabView>
      </form>
    </Card>
  );
};
