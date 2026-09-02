import { useTranslation } from "react-i18next";

import { OrganizationInput } from "@components/business/stamps-input/stamps-input";

interface PublishersInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
}

export const PublishersInput = ({
  value,
  onChange,
  required = true,
}: Readonly<PublishersInputProps>) => {
  const { t } = useTranslation();

  const label = t("common.organization", { lng: "fr" });

  return (
    <OrganizationInput
      value={value}
      onChange={onChange as (value: string | string[]) => void}
      multi
      required={required}
      lang="first"
      labelSingle={label}
      labelMulti={label}
    />
  );
};
