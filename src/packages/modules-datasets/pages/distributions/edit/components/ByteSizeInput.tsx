import { useTranslation } from "react-i18next";

import { NumberInput } from "@components/form/input";

export const ByteSizeInput = ({
  value,
  onChange,
}: Readonly<{
  value: string;
  onChange: (value: string) => void;
}>) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-12 form-group">
      <label htmlFor="taille">{t("distribution.byteSize")}</label>
      <NumberInput id="taille" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
