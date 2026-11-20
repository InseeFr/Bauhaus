import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { PartialStructure } from "@model/structures/Structure";

import { structuresQuery } from "@utils/hooks/structures";
import { useTitle } from "@utils/hooks/useTitle";

import { HomePageMenu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("structure.pluralTitle"), t("structure.pluralTitle"));

  const { data: DSDs } = useSuspenseQuery(structuresQuery());

  return (
    <HomePageLayout title={t("structure.homePageTitle")} menu={<HomePageMenu />}>
      <SearchableList
        items={DSDs}
        childPath="structures"
        advancedSearch
        searchUrl="/structures/search"
        itemFormatter={(_: unknown, structure: PartialStructure) => structure.labelLg1}
      />
    </HomePageLayout>
  );
};
