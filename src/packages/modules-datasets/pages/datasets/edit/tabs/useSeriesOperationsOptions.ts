import { useOperations } from "@utils/hooks/operations";
import { useSeries } from "@utils/hooks/series";

import { Operation } from "../../../../../model/Operation";
import { Options } from "../../../../../model/SelectOption";
import { Series } from "../../../../../model/Series";

const generateOperationsOptionsBasedOnSeries = (
  serie: Series,
  operations: Operation[],
): Options => {
  return operations
    .filter((operation) => operation.seriesIri === serie.iri)
    .map((operation) => {
      return {
        value: operation.iri,
        label: `${operation.label}`,
      };
    });
};

export const useSeriesOperationsOptions = () => {
  const { data: series = [], isLoading: isSeriesLoading } = useSeries();
  const { data: operations = [], isLoading: isOperationsLoading } = useOperations();

  if (isSeriesLoading || isOperationsLoading) {
    return [];
  }
  return series.reduce((options: Options, serie: Series) => {
    return [
      ...options,
      {
        value: serie.iri,
        label: serie.label,
      },
      ...generateOperationsOptionsBasedOnSeries(serie, operations),
    ];
  }, []);
};
