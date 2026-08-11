import { OrganisationInput } from "../../components/business/stamps-input/stamps-input";
import { D1 } from "../i18n/build-dictionary";

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
  return (
    <OrganisationInput
      value={value}
      onChange={onChange as (value: string | string[]) => void}
      multi
      required={required}
      lang="first"
      labelSingle={D1.organisation}
      labelMulti={D1.organisation}
    />
  );
};
