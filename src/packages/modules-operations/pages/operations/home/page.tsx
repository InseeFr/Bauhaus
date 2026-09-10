import { useEffect, useState } from "react";

import { Loading } from "@components/loading";

import { Operation } from "@model/Operation";

import { OperationsApi } from "@sdk/operations-api";

import { sortArray } from "@utils/array-utils";

import { OperationsHome } from "./components/OperationsHome";

export const Component = () => {
  const [operations, setOperations] = useState<Operation[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OperationsApi.getOperationsList()
      .then((result: Operation[]) => setOperations(sortArray("label")(result)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return <OperationsHome operations={operations} />;
};
