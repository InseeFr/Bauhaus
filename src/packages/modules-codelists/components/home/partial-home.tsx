import { useEffect, useState } from "react";

import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { FeminineButton } from "@components/new-button";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { useTitle } from "@utils/hooks/useTitle";

import { HasAccess } from "../../../auth/components/auth";
import { API } from "../../apis";
import D from "../../i18n/build-dictionary";
import { formatLabel } from "../../utils";

export const Component = () => {
  useTitle(D.codelistsTitle, D.codelistsPartialTitle);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCodelistsPartial()
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
        <VerticalMenu>
          <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="CREATE">
            <FeminineButton action="/codelists/partial/create" />
          </HasAccess>
        </VerticalMenu>
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={D.codelistPartialHomePageTitle} col={12} offset={0} />
          <SearchableList
            items={items}
            childPath="codelists/partial"
            advancedSearch
            searchUrl="/codelists/partial/search"
            autoFocus
            itemFormatter={(_: any, codelist: any) => formatLabel(codelist)}
          />
        </div>
      </Row>
    </div>
  );
};
