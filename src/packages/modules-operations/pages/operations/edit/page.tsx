import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { useOperation } from "@utils/hooks/operations";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { OperationsOperationEdition } from "./components/OperationsOperationEdition";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const { data: operation, error: loadError } = useOperation(id);

  const goBack = useGoBack();

  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), operation?.prefLabelLg1);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!operation?.id && id) return <Loading />;

  const editingOperation = operation ?? {};

  return <OperationsOperationEdition id={id} operation={editingOperation} goBack={goBack} />;
};
