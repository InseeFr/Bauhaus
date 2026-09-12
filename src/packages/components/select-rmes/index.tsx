import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { useTranslation } from "react-i18next";

import { Option } from "@model/SelectOption";

import { componentsI18n } from "../i18n";
import "./select-rmes.css";

type SelectRmesTypes = {
  onChange: (value: any) => void;
  unclearable?: boolean;
  multi?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: any;
  options?: Option[];
  itemTemplate?: MultiSelect["props"]["itemTemplate"];
  inputId?: string;
} & {};

export const Select = ({
  onChange,
  unclearable = false,
  multi = false,
  searchable = true,
  disabled = false,
  inputId,
  ...props
}: SelectRmesTypes) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  if (multi) {
    return (
      <MultiSelect
        inputId={inputId}
        placeholder={props.placeholder}
        value={props.value}
        options={props.options}
        onChange={(e) => {
          onChange(e.value);
        }}
        display="chip"
        filter={searchable}
        className="w-full select-rmes-multi"
        disabled={disabled}
        showClear={!unclearable}
        emptyMessage={t("noResult")}
        itemTemplate={props.itemTemplate}
      />
    );
  }

  return (
    <Dropdown
      inputId={inputId}
      placeholder={props.placeholder}
      value={props.value}
      options={props.options}
      onChange={(e) => {
        onChange(e.value);
      }}
      filter={searchable}
      className="w-full select-rmes-single"
      disabled={disabled}
      showClear={!unclearable}
      emptyMessage={t("noResult")}
      itemTemplate={props.itemTemplate}
    />
  );
};
