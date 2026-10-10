import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
import { SearchableList } from "@components/searchable-list";

import { PartialDistribution } from "@model/Dataset";

import { useTitle } from "@utils/hooks/useTitle";

import { useDistributions } from "../../../hooks/useDistributions";
import { HomePageMenu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useDistributions();

  useTitle(t("dataset.pluralTitle"), t("distribution.pluralTitle"));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <HomePageLayout title={t("distribution.homePageTitle")} menu={<HomePageMenu />}>
      <SearchableList
        items={data ?? []}
        childPath="datasets/distributions"
        advancedSearch
        searchUrl="/datasets/distributions/search"
        autoFocus
        itemFormatter={(_: unknown, distribution: PartialDistribution) => distribution.labelLg1}
      />
    </HomePageLayout>
  );
};
