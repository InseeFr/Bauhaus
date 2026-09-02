import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";

import { TreeButton } from "@components/buttons/buttons-with-icons";
import { Row } from "@components/layout";
import { FeminineButton } from "@components/new-button";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { FamilyHome } from "@model/operations/family";

import { useTitle } from "@utils/hooks/useTitle";

import { HasAccess } from "../../../../auth/components/auth";

export const Component = () => {
  const { t } = useTranslation();

  const families = useLoaderData() as FamilyHome[];

  useTitle(t("common.operationsTitle"), t("common.familiesTitle"));

  return (
    <div className="container">
      <Row>
        <VerticalMenu>
          <HasAccess module="OPERATION_FAMILY" privilege="CREATE">
            <FeminineButton action="/operations/families/create" />
          </HasAccess>
          <TreeButton wrapper={false} action="/operations/tree" label={t("app.btnTree")} />
        </VerticalMenu>
        <div className="col-md-8 text-center pull-right operations-list">
          <PageTitle title={t("families.searchTitle")} col={12} offset={0} />
          <SearchableList
            items={families}
            childPath="operations/family"
            label="label"
            searchUrl="/operations/families/search"
            autoFocus={true}
          />
        </div>
      </Row>
    </div>
  );
};
