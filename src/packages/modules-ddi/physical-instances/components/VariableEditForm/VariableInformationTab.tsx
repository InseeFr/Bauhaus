import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { MDEditor } from "@components/rich-editor/react-md-editor";

interface VariableInformationTabProps {
  name: string;
  label: string;
  description: string;
  onNameChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  nameError?: boolean;
  labelError?: boolean;
}

export const VariableInformationTab = ({
  name,
  label,
  description,
  onNameChange,
  onLabelChange,
  onDescriptionChange,
  nameError = false,
  labelError = false,
}: Readonly<VariableInformationTabProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-column gap-3">
      <div className="flex flex-column gap-2">
        <label
          htmlFor="variable-name"
          className={nameError ? "text-red-500" : ""}
        >
          {t("physicalInstance.view.columns.name")} *
        </label>
        <InputText
          id="variable-name"
          name="variableName"
          autoComplete="off"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          className={nameError ? "p-invalid" : ""}
        />
        {nameError && (
          <small className="text-red-500">
            {t("physicalInstance.view.validation.required")}
          </small>
        )}
      </div>

      <div className="flex flex-column gap-2">
        <label
          htmlFor="variable-label"
          className={labelError ? "text-red-500" : ""}
        >
          {t("physicalInstance.view.columns.label")} *
        </label>
        <InputText
          id="variable-label"
          name="variableLabel"
          autoComplete="off"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          required
          className={labelError ? "p-invalid" : ""}
        />
        {labelError && (
          <small className="text-red-500">
            {t("physicalInstance.view.validation.required")}
          </small>
        )}
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="variable-description">
          {t("physicalInstance.view.columns.description")}
        </label>
        <MDEditor text={description} handleChange={onDescriptionChange} />
      </div>
    </div>
  );
};
