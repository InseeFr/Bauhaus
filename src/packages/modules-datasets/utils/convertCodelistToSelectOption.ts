import { CodesList } from "@model/CodesList";
import { Options } from "@model/SelectOption";

export const convertCodelistToSelectOption = (codesList: CodesList): Options =>
  codesList?.codes?.map((code) => ({
    value: code.iri,
    label: code.labelLg1,
  })) ?? [];
