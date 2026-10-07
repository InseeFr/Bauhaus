import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

interface Family {
  id: string;
  label: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  families: Family[];
}>;

export const FamiliesHome = ({ families }: Props) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("family.pluralTitle"));

  return (
    <HomePageLayout title={t("family.searchTitle")}>
      <SearchableList items={families} childPath="classifications/family" autoFocus />
    </HomePageLayout>
  );
};
