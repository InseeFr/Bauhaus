import { useEffect, useState } from "react";

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
  const [codelist, setCodelist] = useState<Codelist>();

  const codelistNotation = codelists.find((cl) => cl.id === attribute.codeList)?.notation;

  useEffect(() => {
    CodelistsApi.getCodelist(codelistNotation).then((cl: Codelist) => setCodelist(cl));
  }, [codelistNotation]);

  if (!codelist) {
    return null;
  }

  const code = codelist.codes.find((c) => c.iri === value);

  return code?.labelLg1;
};
