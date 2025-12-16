import { NumberInput } from "@components/form/input";

import { D1 } from "../../../../../deprecated-locales";

export const ByteSizeInput = ({
  value,
  onChange,
}: Readonly<{
  value: string;
  onChange: (value: string) => void;
}>) => {
  return (
    <div className="col-md-12 form-group">
      <label htmlFor="taille">{D1.tailleTitle}</label>
      <NumberInput id="taille" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
