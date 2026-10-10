import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
import { SearchableList } from "@components/searchable-list";

import { CodelistsApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import { formatLabel } from "../../../utils/formatLabel";
import { HomePageMenu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("codelists.pluralTitle"), t("codelists.pluralTitle"));

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CodelistsApi.getCodelists()
      .then((codelists: any) => {
        setItems(codelists);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <HomePageLayout title={t("codelists.homePageTitle")} menu={<HomePageMenu />}>
      <SearchableList
        items={items}
        childPath="codelists"
        advancedSearch
        searchUrl="/codelists/search"
        autoFocus
        itemFormatter={(_: any, codelist: any) => formatLabel(codelist)}
      />
    </HomePageLayout>
  );
};
