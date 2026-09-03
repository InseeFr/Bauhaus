import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
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
import { NumericRepresentation as NumericRepresentationComponent } from "../NumericRepresentation/NumericRepresentation";
import { DateRepresentation } from "../DateRepresentation/DateRepresentation";
import { TextRepresentation as TextRepresentationComponent } from "../TextRepresentation/TextRepresentation";
import { CodeRepresentation as CodeRepresentationComponent } from "../CodeRepresentation/CodeRepresentation";
import { SentinelValues } from "../SentinelValues/SentinelValues";

interface VariableRepresentationTabProps {
  variableId: string;
  /** Nom de la variable en cours d'édition, cité dans la popup de surcharge de liste partagée. */
  variableName?: string;
  selectedType: string;
  typeOptions: { label: string; value: string }[];
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
  /** MMVR référencées par les autres variables locales non sauvegardées (règle RO/RW sentinelles). */
  locallyUsedMmvrIds?: string[];
  onTypeChange: (value: string) => void;
  onNumericRepresentationChange: (value: NumericRepresentation | undefined) => void;
  onDateRepresentationChange: (value: DateTimeRepresentation | undefined) => void;
  onTextRepresentationChange: (value: TextRepresentation | undefined) => void;
  onCodeRepresentationChange: (
    codeRep: CodeRepresentation | undefined,
    codeList?: CodeList,
    categories?: Category[],
  ) => void;
  onSentinelValuesChange: (
    missingValuesReference: Reference | undefined,
    mmvr?: ManagedMissingValuesRepresentation,
    sentinelCodeList?: CodeList,
    sentinelCategories?: Category[],
  ) => void;
}

export const VariableRepresentationTab = ({
  variableId,
  variableName,
  selectedType,
  typeOptions,
  numericRepresentation,
  dateRepresentation,
  textRepresentation,
  codeRepresentation,
  codeList,
  categories,
  missingValuesReference,
  sentinelMmvr,
  sentinelCodeList,
  sentinelCategories,
  locallyUsedMmvrIds,
  onTypeChange,
  onNumericRepresentationChange,
  onDateRepresentationChange,
  onTextRepresentationChange,
  onCodeRepresentationChange,
  onSentinelValuesChange,
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
          currentVariableName={variableName}
          onChange={onCodeRepresentationChange}
        />
      )}

      {/* Valeurs sentinelles (#1566) : section repliable commune aux quatre types. */}
      {selectedType && (
        <SentinelValues
          key={`${variableId}-sentinel`}
          missingValuesReference={missingValuesReference}
          mmvr={sentinelMmvr}
          sentinelCodeList={sentinelCodeList}
          sentinelCategories={sentinelCategories}
          currentVariableId={variableId}
          locallyUsedMmvrIds={locallyUsedMmvrIds}
          onChange={onSentinelValuesChange}
        />
      )}
    </div>
  );
};
