import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { PartialClassification } from "../../../../types";

interface ClassificationsHomeTypes {
  classifications: PartialClassification[];
}

export const ClassificationsHome = ({ classifications }: Readonly<ClassificationsHomeTypes>) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("classification.pluralTitle"));

  return (
    <HomePageLayout title={t("classification.searchTitle")}>
      <SearchableList
        items={classifications}
        childPath="classifications/classification"
        autoFocus
      />
    </HomePageLayout>
  );
};
