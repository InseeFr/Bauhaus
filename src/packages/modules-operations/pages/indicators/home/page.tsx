import { useTranslation } from "react-i18next";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
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
    <HomePageLayout title={t("indicators.searchTitle")} menu={<Menu />}>
      <SearchableList items={indicators} childPath="operations/indicator" autoFocus />
    </HomePageLayout>
  );
};
