import { Select } from "@components/select-rmes";

import { Option } from "@model/SelectOption";

interface SimsCodelistSelectTypes {
  multi: boolean;
  currentSection: any;
  options: Option[];
  onChange: any;
  /** Transmises telles quelles au Select sous-jacent via `...rest`. */
  disabled?: boolean;
  className?: string;
}

export const SimsCodelistSelect = ({
  multi,
  currentSection,
  options,
  onChange,
  ...rest
}: Readonly<SimsCodelistSelectTypes>) => {
  let value;

  if (!multi) {
    value = currentSection.value;
  } else if (Array.isArray(currentSection.value)) {
    value = currentSection.value;
  } else if (
    currentSection.value === undefined ||
    currentSection.value === null ||
    currentSection.value === ""
  ) {
    value = [];
  } else {
    value = [currentSection.value];
  }

  return (
    <Select
      {...rest}
      placeholder=""
      value={value}
      options={options}
      onChange={onChange}
      multi={multi}
    />
  );
};
