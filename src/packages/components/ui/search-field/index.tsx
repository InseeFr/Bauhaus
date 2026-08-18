import { ReactNode, useId } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { cx } from "@utils/cx";

/**
 * A labelled cell of a form grid.
 *
 * Renders a primeflex `field` column with a `<label>` associated (via `htmlFor`)
 * to the control returned by `children`. The generated id is passed to `children`
 * so the control can wire it (`inputId`/`id`) and stay accessible.
 */
export const SearchField = ({
  label,
  col = "col-12",
  children,
}: Readonly<{
  label: ReactNode;
  col?: string;
  children: (id: string) => ReactNode;
}>) => {
  const id = useId();
  return (
    <div className={cx("field", col)}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
    </div>
  );
};

/**
 * A free-text search criterion: a labelled, search-icon-prefixed input,
 * full width inside its grid column.
 */
export const SearchTextField = ({
  label,
  value,
  onChange,
  col = "col-12",
  placeholder,
}: Readonly<{
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  col?: string;
  placeholder?: string;
}>) => (
  <SearchField label={label} col={col}>
    {(id) => (
      <IconField iconPosition="left" className="w-full">
        <InputIcon className="pi pi-search" />
        <InputText
          id={id}
          className="w-full"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </IconField>
    )}
  </SearchField>
);
