import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { Loading, Publishing } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { Operation } from "@model/Operation";

import { OperationsApi } from "@sdk/operations-api";

import { useSecondLang } from "@utils/hooks/second-lang";

import { OperationsOperationVisualization } from "./components/OperationsOperationVisualization";
import { Menu } from "./menu";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [operation, setOperation] = useState<Operation>({} as Operation);

  const [secondLang] = useSecondLang();

  const [serverSideError, setServerSideError] = useState<string>();

  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (id) {
      OperationsApi.getOperation(id).then((result: Operation) => {
        setOperation(result);
      });
    }
  }, [id]);

  const publish = useCallback(() => {
    setPublishing(true);
    OperationsApi.publishOperation(operation)
      .then(() => {
        return OperationsApi.getOperation(id).then(setOperation);
      })
      .catch((error: string) => setServerSideError(error))
      .finally(() => setPublishing(false));
  }, [operation, id]);

  if (!operation.id) return <Loading />;

  if (publishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock titleLg1={operation.prefLabelLg1} titleLg2={operation.prefLabelLg2} />
      <Menu operation={operation} onPublish={publish} />
      <ErrorBloc error={serverSideError} />
      <CheckSecondLang />
      <OperationsOperationVisualization attr={operation} secondLang={secondLang} />
    </div>
  );
};
