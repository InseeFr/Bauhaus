import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { PartialStructure, StructuresList } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import { HomePageMenu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("structure.pluralTitle"), t("structure.pluralTitle"));

  const [DSDs, setDSDs] = useState<StructuresList>([]);

  useEffect(() => {
    StructureApi.getStructures().then((res: StructuresList) => {
      setDSDs(res);
    });
  }, []);

  return (
    <HomePageLayout title={t("structure.homePageTitle")} menu={<HomePageMenu />}>
      <SearchableList
        items={DSDs}
        childPath="structures"
        advancedSearch
        searchUrl="/structures/search"
        autoFocus
        itemFormatter={(_: unknown, structure: PartialStructure) => structure.labelLg1}
      />
    </HomePageLayout>
  );
};
