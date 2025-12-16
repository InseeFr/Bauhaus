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
}

export const VariableEditForm = ({
  variable,
  typeOptions,
  onSave,
  onDuplicate,
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

  useEffect(() => {
    // Réinitialiser l'onglet actif au premier onglet
    setActiveIndex(0);

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
      case VARIABLE_TYPES.CODE:
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
    <Card title={t("physicalInstance.view.editVariable")} className="h-full">
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
            label={t("physicalInstance.view.save")}
            icon="pi pi-save"
            outlined
            aria-label={t("physicalInstance.view.save")}
          />
        </div>

        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header={t("physicalInstance.view.tabs.information")}>
            <VariableInformationTab
              name={state.name}
              label={state.label}
              description={state.description}
              onNameChange={(value) => dispatch({ type: "SET_NAME", payload: value })}
              onLabelChange={(value) => dispatch({ type: "SET_LABEL", payload: value })}
              onDescriptionChange={(value) => dispatch({ type: "SET_DESCRIPTION", payload: value })}
            />
          </TabPanel>

          <TabPanel header={t("physicalInstance.view.tabs.representation")}>
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

          <TabPanel header={t("physicalInstance.view.tabs.ddiXml")}>
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
