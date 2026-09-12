import { Codelist } from "@model/Codelist";

interface CodeDisplayTypes {
  codelist: Codelist;
  value: string;
}

export const CodeDisplay = ({ codelist, value }: Readonly<CodeDisplayTypes>) => {
  return codelist?.codes?.find((t) => t.iri === value)?.labelLg1;
};
