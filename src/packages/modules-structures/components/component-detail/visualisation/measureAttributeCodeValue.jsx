import { useEffect, useState } from "react";

import { API } from "../../../../modules-codelists/apis";

export const MeasureAttributeCodeValue = ({ value, attribute, codesLists }) => {
  const [codesList, setCodesList] = useState();
  const codeListNotation = codesLists.find((cl) => cl.id === attribute.codeList)?.notation;

  useEffect(() => {
    API.getCodelist(codeListNotation).then((cl) => setCodesList(cl));
  }, [codeListNotation]);

  if (!codesList) {
    return null;
  }

  const code = codesList.codes.find((c) => c.iri === value);
  return <>{code?.labelLg1}</>;
};
