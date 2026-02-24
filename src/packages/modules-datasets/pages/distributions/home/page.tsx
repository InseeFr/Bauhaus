import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { PartialDistribution } from "../../../../model/Dataset";
import { HomePageMenu } from "./menu";
import { useDistributions } from "../../../hooks/useDistributions";

export const Component = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useDistributions();

  useTitle(t("dataset.pluralTitle"), t("distribution.pluralTitle"));

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="container">
      <Row>
        <HomePageMenu />
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={t("distribution.homePageTitle")} col={12} offset={0} />
          <SearchableList
            items={data ?? []}
            childPath="datasets/distributions"
            advancedSearch
            searchUrl="/datasets/distributions/search"
            autoFocus
            itemFormatter={(_: unknown, distribution: PartialDistribution) => distribution.labelLg1}
          />
        </div>
      </Row>
    </div>
  );
};
