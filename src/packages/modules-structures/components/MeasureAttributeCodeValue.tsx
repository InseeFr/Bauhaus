import { useQuery } from "@tanstack/react-query";

import { Codelist, Codelists } from "@model/Codelist";

import { CodelistsApi } from "@sdk/index";

interface MeasureAttributeCodeValueTypes {
  value: string;
  attribute: { codeList?: string };
  codelists: Codelists;
}

export const MeasureAttributeCodeValue = ({
  value,
  attribute,
  codelists,
}: Readonly<MeasureAttributeCodeValueTypes>) => {
  const codelistNotation = codelists.find((cl) => cl.id === attribute.codeList)?.notation;

  // Fiche seule (avec ses codes), distincte de `["codelist", notation]` qui assemble fiche et
  // codes paginés (`fetchCodelist`).
  const { data: codelist } = useQuery<Codelist>({
    queryKey: ["codelist", codelistNotation, "with-codes"],
    queryFn: () => CodelistsApi.getCodelist(codelistNotation),
  });

  if (!codelist) {
    return null;
  }

  const code = codelist.codes.find((c) => c.iri === value);

  return code?.labelLg1;
};
