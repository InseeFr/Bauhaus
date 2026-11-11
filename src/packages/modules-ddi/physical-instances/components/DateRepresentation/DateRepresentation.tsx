import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Dropdown } from "@components/ui/dropdown";

import { DATE_TYPE_VOCABULARY_URI } from "../../constants";
import type { DateTimeRepresentation } from "../../types/api";

interface DateRepresentationProps {
  representation?: DateTimeRepresentation;
  onChange: (representation: DateTimeRepresentation | undefined) => void;
}

const DATE_TYPE_OPTIONS = [
  { value: "DateTime", label: "DateTime" },
  { value: "Date", label: "Date" },
  { value: "Time", label: "Time" },
  { value: "Year", label: "Year" },
  { value: "Month", label: "Month" },
  { value: "Day", label: "Day" },
  { value: "MonthDay", label: "MonthDay" },
  { value: "YearMonth", label: "YearMonth" },
  { value: "Duration", label: "Duration" },
  { value: "Timespan", label: "Timespan" },
];

export const DateRepresentation = ({
  representation,
  onChange,
}: Readonly<DateRepresentationProps>) => {
  const { t } = useTranslation();
  const incomingDateTypeCode = representation?.DateTypeCode?.StringValue || "Date";
  const [dateTypeCode, setDateTypeCode] = useState(incomingDateTypeCode);
  const [previousIncomingDateTypeCode, setPreviousIncomingDateTypeCode] =
    useState(incomingDateTypeCode);

  if (incomingDateTypeCode !== previousIncomingDateTypeCode) {
    setPreviousIncomingDateTypeCode(incomingDateTypeCode);
    setDateTypeCode(incomingDateTypeCode);
  }

  useEffect(() => {
    const newRepresentation: DateTimeRepresentation = {
      $type: "DateTimeRepresentationBaseType",
      DateTypeCode: {
        StringValue: dateTypeCode,
        ControlledVocabularyURI: DATE_TYPE_VOCABULARY_URI,
      },
    };

    onChange(newRepresentation);
  }, [dateTypeCode, onChange]);

  return (
    <div className="flex flex-column gap-2">
      <label htmlFor="date-type">{t("physicalInstance.view.date.type")}</label>
      <Dropdown
        id="date-type"
        name="dateType"
        value={dateTypeCode}
        onChange={(e) => setDateTypeCode(e.value)}
        options={DATE_TYPE_OPTIONS}
        placeholder={t("physicalInstance.view.date.selectType")}
      />
    </div>
  );
};
