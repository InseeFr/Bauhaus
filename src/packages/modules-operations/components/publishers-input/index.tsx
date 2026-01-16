import { Select } from "@components/select-rmes";

import { useOrganizationsOptions } from "@utils/hooks/organizations";

import { D1 } from "../../i18n/build-dictionary";

interface PublishersInputTypes {
  value: string;
  onChange: (value: string) => void;
}
const PublishersInput = ({ value, onChange }: Readonly<PublishersInputTypes>) => {
  const organisationsOptions = useOrganizationsOptions();

  const publishersArray = Array.isArray(value) ? value : [value];

  return (
    <label className="w-100">
      {D1.organisation}

      <Select
        value={publishersArray}
        options={organisationsOptions}
        placeholder=""
        multi
        onChange={(value) => {
          onChange(
            value.map((v: string) => {
              return { id: v };
            }),
          );
        }}
      />
    </label>
  );
};

export default PublishersInput;
