import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";

const MEDIA_TYPE_OPTIONS = ["CSV", "PARQUET", "XSLX"];

type MediaTypeInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const MediaTypeInput = ({ value, onChange }: Readonly<MediaTypeInputProps>) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-6 form-group">
      <label htmlFor="mediaType">{t("distribution.mediaType")}</label>
      <TextInput
        id="mediaType"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list="mediaType-list"
      />
      <datalist id="mediaType-list">
        {MEDIA_TYPE_OPTIONS.map((option) => (
          <option key={option} value={option}></option>
        ))}
      </datalist>
    </div>
  );
};
