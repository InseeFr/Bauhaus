import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

import "../../label-required/index.css";
import { cx } from "@utils/cx";

interface SelectProps {
  label: string;
  placeholder: string;
  value: string | string[] | undefined;
  options: { value: string; label: string }[];
  onChange: (value: string | string[]) => void;
  multi?: boolean;
  required?: boolean;
  filter?: boolean;
}

export const Select = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  multi = false,
  required = false,
  filter = false,
  ...rest
}: Readonly<SelectProps>) => {
  return (
    <label className={cx("w-100", required && "label-required")}>
      <span>
        {label}
        {required && <span className="asterisk">*</span>}
      </span>

      {multi ? (
        <MultiSelect
          placeholder={placeholder}
          value={value}
          options={options}
          onChange={(e) => {
            onChange(e.value);
          }}
          display="chip"
          filter={filter}
          className="w-full"
          style={{ whiteSpace: "normal" }}
          {...rest}
        />
      ) : (
        <Dropdown
          placeholder={placeholder}
          value={value}
          options={options}
          onChange={(e) => {
            onChange(e.value);
          }}
          filter={filter}
          className="w-full"
          {...rest}
        />
      )}
    </label>
  );
};
