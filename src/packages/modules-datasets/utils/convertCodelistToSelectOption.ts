import { Codelist } from "@model/Codelist";
import { Options } from "@model/SelectOption";

export const convertCodelistToSelectOption = (codelist: Codelist): Options =>
  codelist?.codes?.map((code) => ({
    value: code.iri,
    label: code.labelLg1,
  })) ?? [];
