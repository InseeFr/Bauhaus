import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { OperationsApi } from "@sdk/operations-api";

import { useCodelist } from "@utils/hooks/codelist";
import { useOrganizations } from "@utils/hooks/organizations";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { useAppContext } from "../../../../application/app-context";
import { CL_FREQ, CL_SOURCE_CATEGORY } from "../../../../constants/code-lists";
import { OperationsSerieEdition } from "./components/OperationsSerieEdition";

export const Component = (props) => {
  const { t } = useTranslation();

  const { id } = useParams();

  const [serie, setSerie] = useState({});

  const [families, setFamilies] = useState([]);

  const [indicators, setIndicators] = useState([]);

  const [series, setSeries] = useState([]);

  const frequencies = useCodelist(CL_FREQ);

  const categories = useCodelist(CL_SOURCE_CATEGORY);

  const { data: organizations } = useOrganizations();

  const goBack = useGoBack();

  useEffect(() => {
    if (id) {
      OperationsApi.getSerie(id).then((results) => setSerie(results));
    }
  }, [id]);

  useEffect(() => {
    OperationsApi.getAllFamilies().then((results) => setFamilies(results));
  }, []);

  useEffect(() => {
    OperationsApi.getAllIndicators().then((results) => setIndicators(results));
  }, []);

  useEffect(() => {
    OperationsApi.getSeriesList().then((results) => setSeries(results));
  }, []);

  useTitle(t("common.seriesTitle") + " - " + t("common.operationsTitle"), serie?.prefLabelLg1);

  const {
    properties: { extraMandatoryFields },
  } = useAppContext();

  if (!serie.id && id) return <Loading />;

  return (
    <OperationsSerieEdition
      {...props}
      id={id}
      serie={serie}
      categories={categories}
      organizations={organizations}
      series={series}
      families={families}
      indicators={indicators}
      frequencies={frequencies}
      goBack={goBack}
      extraMandatoryFields={extraMandatoryFields}
    />
  );
};
