import { Checkbox } from "primereact/checkbox";
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
  isGeographic: boolean;
  selectedType: string;
  typeOptions: { label: string; value: string }[];
  numericRepresentation?: NumericRepresentation;
  dateRepresentation?: DateTimeRepresentation;
  textRepresentation?: TextRepresentation;
  codeRepresentation?: CodeRepresentation;
  codeList?: CodeList;
  categories?: Category[];
  onIsGeographicChange: (value: boolean) => void;
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
  isGeographic,
  selectedType,
  typeOptions,
  numericRepresentation,
  dateRepresentation,
  textRepresentation,
  codeRepresentation,
  codeList,
  categories,
  onIsGeographicChange,
  onTypeChange,
  onNumericRepresentationChange,
  onDateRepresentationChange,
  onTextRepresentationChange,
  onCodeRepresentationChange,
}: Readonly<VariableRepresentationTabProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-column gap-3">
      <div className="flex align-items-center gap-2 mb-2">
        <Checkbox
          inputId="variable-isGeographic"
          name="isGeographic"
          checked={isGeographic}
          onChange={(e) => onIsGeographicChange(e.checked ?? false)}
        />
        <label htmlFor="variable-isGeographic" className="mb-0">
          {t("physicalInstance.view.isGeographic")}
        </label>
      </div>

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
          onChange={onCodeRepresentationChange}
        />
      )}
    </div>
  );
};
