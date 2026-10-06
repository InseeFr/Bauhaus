import { useCallback, useState } from "react";
import { useParams } from "react-router";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc, LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Publishing } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { useInvalidateOperations, useOperation } from "@utils/hooks/operations";
import { useSecondLang } from "@utils/hooks/second-lang";

import { OperationsOperationVisualization } from "./components/OperationsOperationVisualization";
import { Menu } from "./menu";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [secondLang] = useSecondLang();

  const { data: operation, error: loadError } = useOperation(id);

  const invalidateOperations = useInvalidateOperations();

  const [serverSideError, setServerSideError] = useState<string>();

  const [publishing, setPublishing] = useState(false);

  const publish = useCallback(() => {
    setPublishing(true);
    OperationsApi.publishOperation(operation)
      .then(() => invalidateOperations())
      .catch((error: string) => setServerSideError(error))
      .finally(() => setPublishing(false));
  }, [operation, invalidateOperations]);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!operation) return <Loading />;

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
