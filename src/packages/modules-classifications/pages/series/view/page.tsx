import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { ClassificationsApi } from "@sdk/classification";

import { useSecondLang } from "@utils/hooks/second-lang";

import { SeriesVisualization } from "./components/SeriesVisualization";

interface SeriesGeneral {
  prefLabelLg1: string;
  [key: string]: unknown;
}

interface SeriesMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [series, setSeries] = useState<{
    general: SeriesGeneral;
    members: SeriesMember[];
  }>();

  const [secondLang] = useSecondLang();

  const [loadError, setLoadError] = useState<unknown>();

  useEffect(() => {
    Promise.all([ClassificationsApi.getSeriesGeneral(id), ClassificationsApi.getSeriesMembers(id)])
      .then(([general, members]) => {
        setSeries({
          general: general ?? {},
          members: members ?? [],
        });
      })
      .catch(setLoadError);
  }, [id]);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!series) return <Loading />;

  return <SeriesVisualization series={series} secondLang={secondLang} />;
};
