import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { TextInput } from "@components/form/input";
import { Select } from "@components/select-rmes";

import { Option } from "@model/SelectOption";

import { useStructures } from "@utils/hooks/structures";

import "./data-structure.css";

const STRUCTURE_MODE = "STRUCTURE_MODE";
const URN_MODE = "URN_MODE";

const firstOptions = [
  {
    value: STRUCTURE_MODE,
    label: i18next.t("dataset.statisticalInformation.dataStructure.chooseStructure"),
  },
  {
    value: URN_MODE,
    label: i18next.t("dataset.statisticalInformation.dataStructure.chooseURN"),
  },
];

export const DataStructure = ({
  value,
  onChange,
}: Readonly<{
  value: string;
  onChange: (value: string) => void;
}>) => {
  const { t } = useTranslation();

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
          {t("dataset.statisticalInformation.dataStructure.title")}
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
        <label className="col-md-8">
          {t("dataset.statisticalInformation.dataStructure.title")}
          <Select
            value={value}
            options={options}
            onChange={(value) => {
              onChange(value);
            }}
          />
        </label>
      )}
      {mode === URN_MODE && (
        <label className="col-md-8">
          {t("dataset.statisticalInformation.dataStructure.title")}
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
