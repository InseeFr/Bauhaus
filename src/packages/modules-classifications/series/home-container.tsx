import { Loading } from "@components/loading";

import { useClassificationSeries } from "../hooks/useClassificationSeries";
import SeriesHome from "./home";

export const Component = () => {
  const { isLoading, series } = useClassificationSeries();

  if (isLoading) {
    return <Loading />;
  }

  return <SeriesHome series={series} />;
};
