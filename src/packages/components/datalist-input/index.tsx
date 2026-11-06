import { TextInput } from "@components/form/input";

type DatalistInputProps = {
  id: string;
  label: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
};

/**
 * Champ texte libre proposant des suggestions via une `<datalist>`.
 */
export const DatalistInput = ({
  id,
  label,
  options,
  value,
  onChange,
}: Readonly<DatalistInputProps>) => {
  const listId = `${id}-list`;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <TextInput id={id} value={value} onChange={(e) => onChange(e.target.value)} list={listId} />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </datalist>
    </>
  );
};
