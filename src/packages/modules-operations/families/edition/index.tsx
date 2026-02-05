import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { OperationsApi } from "@sdk/operations-api";

import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../deprecated-locales/build-dictionary";
import { Family } from "../../../model/operations/family";
import OperationsFamilyEdition from "./edition";

export const Component = () => {
  const { id } = useParams();
  const goBack = useGoBack();

  const [family, setFamily] = useState<Family>({} as Family);

  useEffect(() => {
    if (id) {
      OperationsApi.getFamilyById(id).then(setFamily);
    }
  }, [id]);

  useTitle(D.familiesTitle + " - " + D.operationsTitle, family?.prefLabelLg1);

  if (!family.id && id) return <Loading />;
  return <OperationsFamilyEdition id={id} family={family} goBack={goBack} />;
};
