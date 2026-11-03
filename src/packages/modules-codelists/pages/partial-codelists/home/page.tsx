import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
import { FeminineButton } from "@components/new-button";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { CodelistsApi } from "@sdk/codelists-api";

import { useTitle } from "@utils/hooks/useTitle";

import { HasAccess } from "../../../../auth/components/auth";
import { formatLabel } from "../../../utils/formatLabel";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("codelists.pluralTitle"), t("partial-codelists.pluralTitle"));

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CodelistsApi.getCodelistsPartial()
      .then((codelists: any) => {
        setItems(codelists);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <HomePageLayout
      title={t("partial-codelists.homePageTitle")}
      menu={
        <VerticalMenu>
          <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="CREATE">
            <FeminineButton action="/codelists/partial/create" />
          </HasAccess>
        </VerticalMenu>
      }
    >
      <SearchableList
        items={items}
        childPath="codelists/partial"
        advancedSearch
        searchUrl="/codelists/partial/search"
        itemFormatter={(_: any, codelist: any) => formatLabel(codelist)}
      />
    </HomePageLayout>
  );
};
