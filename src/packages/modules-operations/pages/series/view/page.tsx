import { useCallback, useState } from "react";
import { useParams } from "react-router";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc, LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Publishing } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { Series } from "@model/operations/series";

import { OperationsApi } from "@sdk/operations-api";

import { useCodelist } from "@utils/hooks/codelist";
import { useSecondLang } from "@utils/hooks/second-lang";
import { useInvalidateSeries, useSerie } from "@utils/hooks/series";

import { CL_FREQ, CL_SOURCE_CATEGORY } from "../../../../constants/code-lists";
import {
  OperationsSerieVisualization,
  SerieDetail,
} from "./components/OperationsSerieVisualization";
import { Menu } from "./menu";

/**
 * Série telle que consommée par cette page : les champs stricts de `Series`,
 * requis par le menu, complétés par les champs `OPTIONAL` de `SerieDetail`
 * requis par la vue.
 */
type SerieView = Series &
  Omit<SerieDetail, "id" | "creators" | "validationState" | "idSims" | "operations">;

export const Component = () => {
  const { id } = useParams();

  const { data: series, error: loadError } = useSerie<SerieView>(id);

  const invalidateSeries = useInvalidateSeries();

  const [publishing, setPublishing] = useState(false);

  const [serverSideError, setServerSideError] = useState<string>();

  const frequencies = useCodelist(CL_FREQ);

  const categories = useCodelist(CL_SOURCE_CATEGORY);

  const [secondLang] = useSecondLang();

  const frequency = frequencies.codes.find((c) => c.code === series?.accrualPeriodicityCode);

  const category = categories.codes.find((c) => c.code === series?.typeCode);

  const publish = useCallback(() => {
    setPublishing(true);
    OperationsApi.publishSeries(series)
      .then(() => invalidateSeries())
      .catch((error: string) => setServerSideError(error))
      .finally(() => setPublishing(false));
  }, [series, invalidateSeries]);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!series) return <Loading />;

  if (publishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock titleLg1={series.prefLabelLg1} titleLg2={series.prefLabelLg2} />
      <Menu series={series} onPublish={publish} />
      <ErrorBloc error={serverSideError} />
      <CheckSecondLang />
      <OperationsSerieVisualization
        secondLang={secondLang}
        attr={series}
        frequency={frequency}
        category={category}
      />
    </div>
  );
};
