import { useTranslation } from "react-i18next";

import { DatalistInput } from "@components/datalist-input";

const COMPRESS_FORMAT_OPTIONS = ["7Z", "TAR GZ", "ZIP"];

type CompressFormatInputProps = {
  value?: string;
  onChange: (value: string) => void;
};

export const CompressFormatInput = ({ value, onChange }: Readonly<CompressFormatInputProps>) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-6 form-group">
      <DatalistInput
        id="compressFormat"
        label={t("distribution.compressFormat")}
        options={COMPRESS_FORMAT_OPTIONS}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
