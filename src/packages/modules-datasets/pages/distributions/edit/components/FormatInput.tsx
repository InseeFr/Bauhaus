import { useTranslation } from "react-i18next";

import { DatalistInput } from "@components/datalist-input";

const FORMAT_OPTIONS = ["CSV", "PARQUET"];

type FormatInputProps = {
  value?: string;
  onChange: (value: string) => void;
};

export const FormatInput = ({ value, onChange }: Readonly<FormatInputProps>) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-12 form-group">
      <DatalistInput
        id="format"
        label={t("distribution.format")}
        options={FORMAT_OPTIONS}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
