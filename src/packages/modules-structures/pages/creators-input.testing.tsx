// Module de remplacement de `@components/business/creators-input` :
// `vi.mock("@components/business/creators-input", () => import("…/creators-input.testing"))`.

/** Remplace le sélecteur d'organisation par un simple champ texte. */
export const CreatorsInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) => (
  <input
    data-testid="creators-input"
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
  />
);
