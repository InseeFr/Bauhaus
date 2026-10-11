import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { useConcepts } from "../../../hooks/useConcepts";
import { Menu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("concept.title"), t("concept.title"));

  const { concepts, isLoading } = useConcepts();

  if (isLoading) return <Loading />;

  return (
    <HomePageLayout title={t("concept.advancedSearch")} menu={<Menu />}>
      <SearchableList
        items={concepts}
        childPath="concepts"
        advancedSearch
        searchUrl="/concepts/search"
        placeholder={t("concept.searchPlaceholder")}
        autoFocus
      />
    </HomePageLayout>
  );
};
