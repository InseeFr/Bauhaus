import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { CodelistsApi as API } from "@sdk/index";
import { formatLabel } from "../../../utils/formatLabel";
import { HomePageMenu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("codelists.pluralTitle"), t("codelists.pluralTitle"));

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCodelists()
      .then((codelists: any) => {
        setItems(codelists);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container codelists-list">
      <Row>
        <HomePageMenu />
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={t("codelists.homePageTitle")} col={12} offset={0} />
          <SearchableList
            items={items}
            childPath="codelists"
            advancedSearch
            searchUrl="/codelists/search"
            autoFocus
            itemFormatter={(_: any, codelist: any) => formatLabel(codelist)}
          />
        </div>
      </Row>
    </div>
  );
};
