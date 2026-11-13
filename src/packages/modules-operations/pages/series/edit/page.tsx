import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { useCodelist } from "@utils/hooks/codelist";
import { useOrganizations } from "@utils/hooks/organizations";
import { useSerie, useSeries } from "@utils/hooks/series";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { useAppContext } from "../../../../application/app-context";
import { CL_FREQ, CL_SOURCE_CATEGORY } from "../../../../constants/code-lists";
import { useFamilies } from "../../../hooks/useFamilies";
import { useIndicators } from "../../../hooks/useIndicators";
import { OperationsSerieEdition, SerieEditItem } from "./components/OperationsSerieEdition";

// En création, le formulaire part d'une série vide : aucun appel au back n'est fait.
const NEW_SERIE: Partial<SerieEditItem> = {};

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const { data: serie = NEW_SERIE, error: serieError } = useSerie<SerieEditItem>(id);

  const { data: families = [], error: familiesError } = useFamilies();

  const { data: indicators = [], error: indicatorsError } = useIndicators();

  const { data: series = [], error: seriesError } = useSeries();

  const frequencies = useCodelist(CL_FREQ);

  const categories = useCodelist(CL_SOURCE_CATEGORY);

  const { data: organizations } = useOrganizations();

  const goBack = useGoBack();

  useTitle(t("common.seriesTitle") + " - " + t("common.operationsTitle"), serie?.prefLabelLg1);

  const {
    properties: { extraMandatoryFields },
  } = useAppContext();

  const loadError = serieError ?? familiesError ?? indicatorsError ?? seriesError;

  if (loadError) return <LoadingErrorBloc error={loadError} />;

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
