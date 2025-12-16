import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { OperationsApi } from "@sdk/operations-api";

import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../deprecated-locales";
import { Operation } from "../../../model/Operation";
import OperationsOperationEdition from "./edition";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const [operation, setOperation] = useState<Operation | undefined>(undefined);
  const goBack = useGoBack();

  useEffect(() => {
    if (id) {
      OperationsApi.getOperation(id).then((result: Operation) => {
        setOperation(result);
      });
    }
  }, [id]);

  useTitle(D.operationsTitle, operation?.prefLabelLg1);

  if (!operation?.id && id) return <Loading />;

  const editingOperation = operation ?? {};
  return <OperationsOperationEdition id={id} operation={editingOperation} goBack={goBack} />;
};
