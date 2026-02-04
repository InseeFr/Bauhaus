import { useState } from "react";

import { TextInput } from "@components/form/input";
import { Select } from "@components/select-rmes";

import { Option } from "@model/SelectOption";

import { createDictionary, firstLang } from "@utils/dictionnary";
import { useStructures } from "@utils/hooks/structures";

import { D1 } from "../../../../../../deprecated-locales";
import "./data-structure.css";

const STRUCTURE_MODE = "STRUCTURE_MODE";
const URN_MODE = "URN_MODE";

const D = createDictionary(firstLang, {
  chooseUrn: {
    fr: "Saisir une URN",
    en: "Type a URN",
  },
  chooseStructure: {
    fr: "Choisir une structure",
    en: "Choose a structure",
  },
});

const firstOptions = [
  { value: STRUCTURE_MODE, label: D.chooseStructure },
  { value: URN_MODE, label: D.chooseUrn },
];

export const DataStructure = ({
  value,
  onChange,
}: Readonly<{
  value: string;
  onChange: (value: string) => void;
}>) => {
  const { data: structures } = useStructures();
  const options: Option[] =
    structures?.map(({ iri, labelLg1 }) => ({ value: iri, label: labelLg1 })) ?? [];

  const [mode, setMode] = useState<typeof URN_MODE | typeof STRUCTURE_MODE | null>(
    structures?.find((s) => s.iri === value) ? STRUCTURE_MODE : value ? URN_MODE : null,
  );

  return (
    <>
      <div className="col-md-4 form-group">
        <label className="w-100 wilco-label-required">
          {D1.datasetsDataStructure}
          <Select
            value={mode}
            options={firstOptions}
            onChange={(m) => {
              setMode(m);
              onChange("");
            }}
          />
        </label>
      </div>
      {mode === STRUCTURE_MODE && (
        <>
          <label className="col-md-8">
            {D1.datasetsDataStructure}
            <Select
              value={value}
              options={options}
              onChange={(value) => {
                onChange(value);
              }}
            />
          </label>
        </>
      )}

      {mode === URN_MODE && (
        <label className="col-md-8">
          {D1.datasetsDataStructure}
          <TextInput
            aria-describedby="datastructure-error"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        </label>
      )}
    </>
  );
};
