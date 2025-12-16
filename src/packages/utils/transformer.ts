import { Option, Options } from "../model/SelectOption";

export const transformModelToSelectOptions = (datas: { id: string; label: string }[]): Options => {
  return datas.map(transformModelToSelectOption);
};

export const transformModelToSelectOptionWithPrefix = (prefix: string) => {
  return ({ id, label }: { id: string; label: string }): Option => {
    return {
      value: id,
      label: `${prefix}${label}`,
    };
  };
};

export const transformModelToSelectOption = transformModelToSelectOptionWithPrefix("");
