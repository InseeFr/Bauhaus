import { ComponentProps } from "react";

import { useOrganizations } from "@utils/hooks/organizations";
import { useV2StampsOptions } from "@utils/hooks/stamps";

import D, { D1 } from "../../i18n";
import { Select } from "../../ui/select";

const DefaultStampsInput = ({
  value,
  onChange,
  multi = false,
  required = true,
  lang = "first",
  labelSingle,
  labelMulti,
  options,
  ...rest
}: Readonly<{
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multi?: boolean;
  required?: boolean;
  lang: "first" | "default";
  labelSingle: string;
  labelMulti: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}>) => {
  let creatorsArray;
  if (multi) {
    creatorsArray = Array.isArray(value) && value.length > 0 ? value : [];
  } else {
    creatorsArray = value ? value : undefined;
  }

  const Dictionary = lang === "first" ? D1 : D;

  const label = !multi ? labelSingle : labelMulti;

  return (
    <Select
      label={label}
      placeholder={Dictionary.stampsPlaceholder}
      value={creatorsArray}
      options={options}
      onChange={onChange}
      multi={multi}
      required={required}
      filter={true}
      {...rest}
    />
  );
};

// @depreated
export const StampsInput = (
  props: Readonly<Omit<ComponentProps<typeof DefaultStampsInput>, "options">>,
) => {
  const stampsOptions = useV2StampsOptions();

  return <DefaultStampsInput {...props} options={stampsOptions} />;
};

export const OrganizationInput = (
  props: Readonly<Omit<ComponentProps<typeof DefaultStampsInput>, "options">>,
) => {
  const { data: organizations } = useOrganizations();

  return (
    <DefaultStampsInput
      {...props}
      options={(organizations ?? []).map((o) => ({
        value: o.iri,
        label: o.label,
      }))}
    />
  );
};
