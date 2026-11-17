import { useTranslation } from "react-i18next";

import { DatalistInput } from "@components/datalist-input";

const MEDIA_TYPE_OPTIONS = ["CSV", "PARQUET", "XSLX"];

type MediaTypeInputProps = {
  value?: string;
  onChange: (value: string) => void;
};

export const MediaTypeInput = ({ value, onChange }: Readonly<MediaTypeInputProps>) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-6 form-group">
      <DatalistInput
        id="mediaType"
        label={t("distribution.mediaType")}
        options={MEDIA_TYPE_OPTIONS}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
