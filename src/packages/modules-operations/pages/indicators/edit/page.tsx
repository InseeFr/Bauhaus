import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { Indicator, IndicatorsList } from "@model/operations/indicator";
import { Series } from "@model/Series";

import { OperationsApi } from "@sdk/operations-api";

import { useCodesList } from "@utils/hooks/codeslist";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { CL_FREQ } from "../../../../constants/code-lists";
import { OperationsIndicatorEdition } from "./components/OperationsIndicatorEdition";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const frequencies = useCodesList(CL_FREQ);

  const goBack = useGoBack();

  const { t } = useTranslation();

  // En création, le formulaire part d'un indicateur vide qu'il complète avec ses
  // propres valeurs par défaut : aucun appel au back n'est fait.
  const [indicator, setIndicator] = useState<Indicator>({} as Indicator);

  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    if (id) {
      OperationsApi.getIndicatorById(id).then(setIndicator);
    }
  }, [id]);

  const [indicators, setIndicators] = useState<IndicatorsList>([]);

  useEffect(() => {
    OperationsApi.getAllIndicators().then(setIndicators);
  }, []);

  useEffect(() => {
    OperationsApi.getSeriesList().then(setSeries);
  }, []);

  useTitle(t("common.indicatorsTitle"), indicator.prefLabelLg1);

  if (!indicator.id && id) return <Loading />;

  return (
    <OperationsIndicatorEdition
      series={series}
      indicators={indicators}
      frequencies={frequencies}
      indicator={indicator}
      goBack={goBack}
    />
  );
};
