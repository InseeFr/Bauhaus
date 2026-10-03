import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { Family } from "@model/operations/family";

import { OperationsApi } from "@sdk/operations-api";

import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { OperationsFamilyEdition } from "./components/OperationsFamilyEdition";

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const goBack = useGoBack();

  const [family, setFamily] = useState<Family>({} as Family);

  const [loadError, setLoadError] = useState<unknown>();

  useEffect(() => {
    if (id) {
      OperationsApi.getFamilyById(id).then(setFamily).catch(setLoadError);
    }
  }, [id]);

  useTitle(t("common.familiesTitle") + " - " + t("common.operationsTitle"), family?.prefLabelLg1);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!family.id && id) return <Loading />;

  return <OperationsFamilyEdition id={id} family={family} goBack={goBack} />;
};
