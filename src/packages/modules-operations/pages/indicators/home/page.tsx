import { useEffect, useState } from "react";

import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { OperationsApi } from "@sdk/operations-api";

import { useTitle } from "@utils/hooks/useTitle";

import { useTranslation } from "react-i18next";

import { IndicatorsList } from "../../../../model/operations/indicator";
import { Menu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("common.indicatorsTitle"));

  const [loading, setLoading] = useState(true);

  const [indicators, setIndicators] = useState<IndicatorsList>([]);

  useEffect(() => {
    OperationsApi.getAllIndicators()
      .then((payload: IndicatorsList) => setIndicators(payload))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container">
      <Row>
        <Menu></Menu>
        <div className="col-md-8 text-center pull-right operations-list">
          <PageTitle title={t("indicators.searchTitle")} col={12} offset={0} />
          <SearchableList items={indicators} childPath="operations/indicator" autoFocus />
        </div>
      </Row>
    </div>
  );
};
