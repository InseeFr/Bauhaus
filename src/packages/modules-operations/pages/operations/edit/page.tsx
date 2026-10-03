import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { Operation } from "@model/Operation";

import { OperationsApi } from "@sdk/operations-api";

import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { OperationsOperationEdition } from "./components/OperationsOperationEdition";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [operation, setOperation] = useState<Operation | undefined>(undefined);

  const [loadError, setLoadError] = useState<unknown>();

  const goBack = useGoBack();

  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      OperationsApi.getOperation(id)
        .then((result: Operation) => {
          setOperation(result);
        })
        .catch(setLoadError);
    }
  }, [id]);

  useTitle(t("common.operationsTitle"), operation?.prefLabelLg1);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!operation?.id && id) return <Loading />;

  const editingOperation = operation ?? {};

  return <OperationsOperationEdition id={id} operation={editingOperation} goBack={goBack} />;
};
