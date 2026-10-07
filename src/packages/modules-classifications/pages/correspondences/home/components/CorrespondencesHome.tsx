import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

export const CorrespondencesHome = ({ correspondences }: { correspondences: any }) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("correspondence.pluralTitle"));

  return (
    <HomePageLayout title={t("correspondence.searchTitle")}>
      <SearchableList
        items={correspondences}
        childPath="classifications/correspondence"
        autoFocus
      />
    </HomePageLayout>
  );
};
