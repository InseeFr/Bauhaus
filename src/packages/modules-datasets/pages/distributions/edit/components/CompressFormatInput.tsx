import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";

const COMPRESS_FORMAT_OPTIONS = ["7Z", "TAR GZ", "ZIP"];

type CompressFormatInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const CompressFormatInput = ({ value, onChange }: Readonly<CompressFormatInputProps>) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-6 form-group">
      <label htmlFor="compressFormat">{t("distribution.compressFormat")}</label>
      <TextInput
        id="compressFormat"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list="compressFormat-list"
      />
      <datalist id="compressFormat-list">
        {COMPRESS_FORMAT_OPTIONS.map((option) => (
          <option key={option} value={option}></option>
        ))}
      </datalist>
    </div>
  );
};
