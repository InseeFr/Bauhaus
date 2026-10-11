import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { FeminineButton } from "@components/new-button";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { Series } from "@model/Series";

import { useTitle } from "@utils/hooks/useTitle";

import { HasAccess } from "../../../../../auth/components/auth";

export function SeriesHome({ series }: Readonly<{ series: Series[] }>) {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("common.seriesTitle"));

  return (
    <HomePageLayout
      title={t("series.searchTitle")}
      menu={
        <VerticalMenu>
          <HasAccess module="OPERATION_SERIES" privilege="CREATE">
            <FeminineButton action="/operations/series/create" />
          </HasAccess>
        </VerticalMenu>
      }
    >
      <SearchableList
        items={series}
        childPath="operations/series"
        label="label"
        searchUrl="/operations/series/search"
        advancedSearch={true}
        autoFocus={true}
      />
    </HomePageLayout>
  );
}
