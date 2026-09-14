import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { FamilyHome } from "@model/operations/family";

import { OperationsApi } from "@sdk/operations-api";

import { useCodelist } from "@utils/hooks/codelist";
import { useOrganizations } from "@utils/hooks/organizations";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { useAppContext } from "../../../../application/app-context";
import { CL_FREQ, CL_SOURCE_CATEGORY } from "../../../../constants/code-lists";
import {
  OperationsSerieEdition,
  SerieEditItem,
  SeriesOrIndicatorItem,
} from "./components/OperationsSerieEdition";

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const [serie, setSerie] = useState<Partial<SerieEditItem>>({});

  const [families, setFamilies] = useState<FamilyHome[]>([]);

  const [indicators, setIndicators] = useState<SeriesOrIndicatorItem[]>([]);

  const [series, setSeries] = useState<SeriesOrIndicatorItem[]>([]);

  const frequencies = useCodelist(CL_FREQ);

  const categories = useCodelist(CL_SOURCE_CATEGORY);

  const { data: organizations } = useOrganizations();

  const goBack = useGoBack();

  useEffect(() => {
    if (id) {
      OperationsApi.getSerie(id).then((results: SerieEditItem) => setSerie(results));
    }
  }, [id]);

  useEffect(() => {
    OperationsApi.getAllFamilies().then((results: FamilyHome[]) => setFamilies(results));
  }, []);

  useEffect(() => {
    OperationsApi.getAllIndicators().then((results: SeriesOrIndicatorItem[]) =>
      setIndicators(results),
    );
  }, []);

  useEffect(() => {
    OperationsApi.getSeriesList().then((results: SeriesOrIndicatorItem[]) => setSeries(results));
  }, []);

  useTitle(t("common.seriesTitle") + " - " + t("common.operationsTitle"), serie?.prefLabelLg1);

  const {
    properties: { extraMandatoryFields },
  } = useAppContext();

  if (!serie.id && id) return <Loading />;

  return (
    <OperationsSerieEdition
      id={id}
      serie={serie}
      categories={categories}
      organizations={organizations}
      series={series}
      families={families}
      indicators={indicators}
      frequencies={frequencies}
      goBack={goBack}
      // `AppProperties.extraMandatoryFields` is declared as a raw `string` in
      // the app context, but this backend property is actually an array of
      // field names, as consumed by `validate()` and `isMandatoryField()`.
      extraMandatoryFields={extraMandatoryFields as unknown as string[]}
    />
  );
};
