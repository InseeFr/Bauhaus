/**
 * Doublures légères des composants PrimeReact utilisés par l'édition d'une liste de codes.
 *
 * Chaque export remplace le composant de même nom ; usage :
 * `vi.mock("primereact/inputtext", () => import("./primereact.testing"));`
 */
import { forwardRef, useImperativeHandle } from "react";

export const InputText = ({ id, value, onChange, placeholder, ...props }: any) => (
  <input
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    data-testid={id || placeholder}
    {...props}
  />
);

// Le contenu du menu contextuel est rendu en ligne : les entrées sont ainsi directement
// interrogeables, sans avoir à ouvrir un vrai overlay.
export const OverlayPanel = forwardRef(({ children }: any, ref: any) => {
  useImperativeHandle(ref, () => ({ toggle: () => {}, hide: () => {} }));
  return <div>{children}</div>;
});

export const Column = () => null;

export const ProgressSpinner = ({ style }: any) => (
  <div data-testid="progress-spinner" style={style}>
    Loading...
  </div>
);

export const Message = ({ severity, text }: any) => (
  <div data-testid={`message-${severity}`}>{text}</div>
);

/** Liste déroulante groupée rendue en `<select>` / `<optgroup>`. */
export const Dropdown = ({
  value,
  options,
  onChange,
  placeholder,
  className,
  optionGroupLabel,
  optionGroupChildren,
  optionLabel,
  optionValue,
  itemTemplate,
}: any) => (
  <select
    data-testid="code-list-dropdown"
    value={value || ""}
    onChange={(e) => onChange({ value: e.target.value })}
    className={className}
  >
    <option value="" disabled>
      {placeholder}
    </option>
    {options?.map((group: any) => (
      <optgroup key={group[optionGroupLabel]} label={group[optionGroupLabel]}>
        {group[optionGroupChildren].map((option: any) => (
          <option key={option[optionValue]} value={option[optionValue]}>
            {itemTemplate ? itemTemplate(option) : option[optionLabel]}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
);
