import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { FeminineButton } from "@components/new-button";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { useTitle } from "@utils/hooks/useTitle";

import { HasAccess } from "../../../../../auth/components/auth";
import { Series } from "../../../../../model/Series";

export function SeriesHome({ series }: Readonly<{ series: Series[] }>) {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("common.seriesTitle"));

  return (
    <div className="container">
      <Row>
        <VerticalMenu>
          <HasAccess module="OPERATION_SERIES" privilege="CREATE">
            <FeminineButton action="/operations/series/create" />
          </HasAccess>
        </VerticalMenu>
        <div className="col-md-8 text-center pull-right operations-list">
          <PageTitle title={t("series.searchTitle")} col={12} offset={0} />
          <SearchableList
            items={series}
            childPath="operations/series"
            label="label"
            searchUrl="/operations/series/search"
            advancedSearch={true}
            autoFocus={true}
          />
        </div>
      </Row>
    </div>
  );
}
