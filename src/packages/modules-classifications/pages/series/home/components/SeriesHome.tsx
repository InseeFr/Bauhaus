import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { PartialClassificationSerie } from "@model/Classification";

import { useTitle } from "@utils/hooks/useTitle";

export const SeriesHome = ({
  series,
}: Readonly<{ series: PartialClassificationSerie[] | undefined }>) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("serie.pluralTitle"));

  if (!series) {
    return null;
  }

  return (
    <HomePageLayout title={t("serie.searchTitle")}>
      <SearchableList items={series} childPath="classifications/series" autoFocus />
    </HomePageLayout>
  );
};
