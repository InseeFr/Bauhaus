import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { sortArrayByLabel } from "@utils/array-utils";
import { useSeries } from "@utils/hooks/series";

import { SeriesHome } from "./components/SeriesHome";

export const Component = () => {
  const { data: series = [], isLoading, error } = useSeries();

  if (isLoading) return <Loading />;

  if (error) return <LoadingErrorBloc error={error} />;

  return <SeriesHome series={sortArrayByLabel(series)} />;
};
