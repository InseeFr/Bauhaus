import { useTranslation } from "react-i18next";

import { OrganisationInput } from "../../components/business/stamps-input/stamps-input";

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

  const label = t("common.organisation", { lng: "fr" });

  return (
    <OrganisationInput
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
