import { OrganisationInput } from "../../../components/business/stamps-input/stamps-input";
import { D1 } from "../../i18n/build-dictionary";

interface PublishersInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const PublishersInput = ({ value, onChange }: Readonly<PublishersInputProps>) => {
  return (
    <OrganisationInput
      value={value}
      onChange={onChange as (value: string | string[]) => void}
      multi
      lang="first"
      labelSingle={D1.organisation}
      labelMulti={D1.organisation}
    />
  );
};

export default PublishersInput;
