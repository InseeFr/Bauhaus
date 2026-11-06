import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { Indicator } from "@model/operations/indicator";

import { useCodelist } from "@utils/hooks/codelist";
import { useSeries } from "@utils/hooks/series";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { CL_FREQ } from "../../../../constants/code-lists";
import { useIndicator, useIndicators } from "../../../hooks/useIndicators";
import { OperationsIndicatorEdition } from "./components/OperationsIndicatorEdition";

// En création, le formulaire part d'un indicateur vide qu'il complète avec ses
// propres valeurs par défaut : aucun appel au back n'est fait.
const NEW_INDICATOR = {} as Indicator;

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const frequencies = useCodelist(CL_FREQ);

  const goBack = useGoBack();

  const { t } = useTranslation();

  const { data: indicator = NEW_INDICATOR, error: indicatorError } = useIndicator(id);

  const { data: indicators = [], error: indicatorsError } = useIndicators();

  const { data: series = [], error: seriesError } = useSeries();

  useTitle(t("common.indicatorsTitle"), indicator.prefLabelLg1);

  const loadError = indicatorError ?? indicatorsError ?? seriesError;

  if (loadError) return <LoadingErrorBloc error={loadError} />;

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
