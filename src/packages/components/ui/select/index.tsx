import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import LabelRequired from "../../label-required";

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
}: SelectProps) => {
  return (
    <>
      {required ? <LabelRequired>{label}</LabelRequired> : <label>{label}</label>}

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
        />
      )}
    </>
  );
};
