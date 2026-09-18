/**
 * Doublures partagées par les specs des composants de représentation de variable.
 *
 * Les composants s'emploient comme module de remplacement :
 * `vi.mock("primereact/dropdown", () => import("../representation.testing"));`
 */
import type { ChangeEvent } from "react";

/** Module `react-i18next` qui traduit les clés connues et renvoie les autres telles quelles. */
export const mockTranslations = (translations: Record<string, string>) => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] || key,
  }),
});

/** Module `application/app-context` exposant l'agence par défaut `fr.insee`. */
export const appContextModule = {
  useAppContext: () => ({
    properties: {
      defaultAgencyId: "fr.insee",
    },
  }),
};

/** `<select>` natif alimenté par des options `{ label, value }`, au contrat onChange de PrimeReact. */
export const OptionsSelect = ({ options, onChange, ...props }: any) => (
  <select
    {...props}
    onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ value: e.target.value })}
  >
    {options.map((option: any) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export const Dropdown = ({ id, value, onChange, options, required }: any) => (
  <OptionsSelect id={id} value={value} onChange={onChange} options={options} required={required} />
);

export const InputText = ({ id, value, onChange, type, ...props }: any) => (
  <input id={id} type={type} value={value} onChange={onChange} {...props} />
);

export const Button = ({ label, onClick, type = "button", disabled }: any) => (
  <button type={type} onClick={onClick} disabled={disabled}>
    {label}
  </button>
);
