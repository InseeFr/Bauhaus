import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import type {
  NumericRepresentation,
  DateTimeRepresentation,
  TextRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
} from "../../types/api";
import { NumericRepresentation as NumericRepresentationComponent } from "../NumericRepresentation/NumericRepresentation";
import { DateRepresentation } from "../DateRepresentation/DateRepresentation";
import { TextRepresentation as TextRepresentationComponent } from "../TextRepresentation/TextRepresentation";
import { CodeRepresentation as CodeRepresentationComponent } from "../CodeRepresentation/CodeRepresentation";

interface VariableRepresentationTabProps {
  variableId: string;
  selectedType: string;
  typeOptions: { label: string; value: string }[];
  numericRepresentation?: NumericRepresentation;
  dateRepresentation?: DateTimeRepresentation;
  textRepresentation?: TextRepresentation;
  codeRepresentation?: CodeRepresentation;
  codeList?: CodeList;
  categories?: Category[];
  onTypeChange: (value: string) => void;
  onNumericRepresentationChange: (value: NumericRepresentation | undefined) => void;
  onDateRepresentationChange: (value: DateTimeRepresentation | undefined) => void;
  onTextRepresentationChange: (value: TextRepresentation | undefined) => void;
  onCodeRepresentationChange: (
    codeRep: CodeRepresentation | undefined,
    codeList?: CodeList,
    categories?: Category[],
  ) => void;
}

export const VariableRepresentationTab = ({
  variableId,
  selectedType,
  typeOptions,
  numericRepresentation,
  dateRepresentation,
  textRepresentation,
  codeRepresentation,
  codeList,
  categories,
  onTypeChange,
  onNumericRepresentationChange,
  onDateRepresentationChange,
  onTextRepresentationChange,
  onCodeRepresentationChange,
}: Readonly<VariableRepresentationTabProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-column gap-3">
      <div className="flex flex-column gap-2">
        <label htmlFor="variable-type">{t("physicalInstance.view.columns.type")}</label>
        <Dropdown
          key={`${variableId}-type`}
          id="variable-type"
          name="type"
          value={selectedType}
          onChange={(e) => onTypeChange(e.value)}
          options={typeOptions}
          placeholder={t("physicalInstance.view.selectType")}
          required
        />
      </div>

      {selectedType === "numeric" && (
        <NumericRepresentationComponent
          representation={numericRepresentation}
          onChange={onNumericRepresentationChange}
        />
      )}

      {selectedType === "date" && (
        <DateRepresentation
          representation={dateRepresentation}
          onChange={onDateRepresentationChange}
        />
      )}

      {selectedType === "text" && (
        <TextRepresentationComponent
          representation={textRepresentation}
          onChange={onTextRepresentationChange}
        />
      )}

      {selectedType === "code" && (
        <CodeRepresentationComponent
          representation={codeRepresentation}
          codeList={codeList}
          categories={categories}
          currentVariableId={variableId}
          onChange={onCodeRepresentationChange}
        />
      )}
    </div>
  );
};
