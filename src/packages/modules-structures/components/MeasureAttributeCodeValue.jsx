import { useEffect, useState } from "react";

import { CodelistsApi } from "@sdk/index";

export const MeasureAttributeCodeValue = ({ value, attribute, codelists }) => {
  const [codelist, setCodelist] = useState();

  const codelistNotation = codelists.find((cl) => cl.id === attribute.codeList)?.notation;

  useEffect(() => {
    CodelistsApi.getCodelist(codelistNotation).then((cl) => setCodelist(cl));
  }, [codelistNotation]);

  if (!codelist) {
    return null;
  }

  const code = codelist.codes.find((c) => c.iri === value);

  return code?.labelLg1;
};
