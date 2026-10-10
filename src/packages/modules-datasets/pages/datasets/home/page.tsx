import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
import { SearchableList } from "@components/searchable-list";

import { PartialDataset } from "@model/Dataset";

import { useTitle } from "@utils/hooks/useTitle";

import { useDatasets } from "../../../hooks/useDatasets";
import { HomePageMenu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useDatasets();

  useTitle(t("dataset.pluralTitle"), t("dataset.pluralTitle"));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <HomePageLayout title={t("dataset.homePageTitle")} menu={<HomePageMenu />}>
      <SearchableList
        items={data ?? []}
        childPath="datasets"
        advancedSearch
        searchUrl="/datasets/search"
        autoFocus
        itemFormatter={(_: unknown, dataset: PartialDataset) => dataset.label}
      />
    </HomePageLayout>
  );
};
