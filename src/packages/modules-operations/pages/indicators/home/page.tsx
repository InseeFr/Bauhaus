import { useTranslation } from "react-i18next";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { useIndicators } from "../../../hooks/useIndicators";
import { Menu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("common.indicatorsTitle"));

  const { data: indicators = [], isLoading, error } = useIndicators();

  if (isLoading) return <Loading />;

  if (error) return <LoadingErrorBloc error={error} />;

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
