import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { PartialDataset } from "../../../../model/Dataset";
import { HomePageMenu } from "./menu";
import { useDatasets } from "../../../hooks/useDatasets";

export const Component = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useDatasets();

  useTitle(t("dataset.pluralTitle"), t("dataset.pluralTitle"));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <Row>
        <HomePageMenu />
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={t("dataset.homePageTitle")} col={12} offset={0} />
          <SearchableList
            items={data ?? []}
            childPath="datasets"
            advancedSearch
            searchUrl="/datasets/search"
            autoFocus
            itemFormatter={(_: unknown, dataset: PartialDataset) => dataset.label}
          />
        </div>
      </Row>
    </div>
  );
};
