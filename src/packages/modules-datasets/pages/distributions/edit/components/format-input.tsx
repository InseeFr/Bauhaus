import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";

const FORMAT_OPTIONS = ["CSV", "PARQUET"];

type FormatInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const FormatInput = ({ value, onChange }: Readonly<FormatInputProps>) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-12 form-group">
      <label htmlFor="format">{t("distribution.format")}</label>
      <TextInput
        id="format"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list="format-list"
      />
      <datalist id="format-list">
        {FORMAT_OPTIONS.map((option) => (
          <option key={option} value={option}></option>
        ))}
      </datalist>
    </div>
  );
};
