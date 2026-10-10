import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { Menu } from "../menu";

interface CollectionsHomeTypes {
  collections: { id: string; label: string }[];
}

export const CollectionsHome = ({ collections }: Readonly<CollectionsHomeTypes>) => {
  const { t } = useTranslation();

  useTitle(t("concept.title"), t("collection.title"));

  return (
    <HomePageLayout title={t("collection.search.title")} menu={<Menu />}>
      <SearchableList items={collections} childPath="concepts/collections" autoFocus />
    </HomePageLayout>
  );
};
