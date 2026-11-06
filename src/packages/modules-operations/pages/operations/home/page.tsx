import { useMemo } from "react";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { sortArray } from "@utils/array-utils";
import { useOperations } from "@utils/hooks/operations";

import { OperationsHome } from "./components/OperationsHome";

export const Component = () => {
  const { data, isLoading, error } = useOperations();

  const operations = useMemo(() => sortArray("label")(data ?? []), [data]);

  if (isLoading) return <Loading />;

  if (error) return <LoadingErrorBloc error={error} />;

  return <OperationsHome operations={operations} />;
};
