// Module de remplacement de `@components/business/creators-input` :
// `vi.mock("@components/business/creators-input", () => import("…/creators-input.testing"))`.

import { ChangeEvent, useCallback } from "react";

/** Remplace le sélecteur d'organisation par un simple champ texte. */
export const CreatorsInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );
  return <input data-testid="creators-input" value={value ?? ""} onChange={handleChange} />;
};
